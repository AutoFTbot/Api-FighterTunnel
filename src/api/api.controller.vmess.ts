import { Controller, Get, Query } from '@nestjs/common';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { Base64 } from 'js-base64';
import { TextDecoder } from 'text-encoding-utf-8';
import * as dotenv from 'dotenv';
import TelegramBot = require('node-telegram-bot-api');

dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const servername = process.env.SERVER;
const UrlWeb = process.env.WEB_URL;
const bot = new TelegramBot(botToken);

@Controller('api')
export class ApiVmessController {

  @Get('create-vmess')
  createVmess(@Query('user') user: string, @Query('exp') exp: string, @Query('quota') quota: string, @Query('limitip') limitip: string) {
    try {
      const cmd = `printf "%s\n" "${user}" "${exp}" "${quota}" "${limitip}" | add-ws`;
      console.log('Running command:', cmd);
      
      const result = execSync(cmd, { stdio: 'pipe', maxBuffer: 10 * 1024 * 1024 }).toString();
      console.log('Command output:', result);
      
      const vmessUrls = result.match(/vmess:\/\/[^\s]+/g);
      if (!vmessUrls || vmessUrls.length < 3) {
        console.error('Error: No Vmess URLs found or insufficient URLs.');
        return { status: 'error', message: 'No Vmess URLs found or insufficient URLs.' };
      }

      const config = fs.readFileSync('/etc/ftvpn/var.txt', 'utf-8').split('\n');
      console.log('Configuration data:', config);
      
      const DOMAIN = config.find(line => line.startsWith('DOMAIN'))?.split('=')[1].replace(/"/g, '').trim();
      const PUB = config.find(line => line.startsWith('PUB'))?.split('=')[1].replace(/"/g, '').trim();
      const HOST = config.find(line => line.startsWith('HOST'))?.split('=')[1].replace(/"/g, '').trim();

      if (!DOMAIN || !PUB || !HOST) {
        console.error('Error: Missing configuration data.');
        return { status: 'error', message: 'Error fetching configuration data from /etc/ftvpn/var.txt' };
      }

      const decodedVmess = Base64.decode(vmessUrls[0].replace('vmess://', '').trim());
      console.log('Decoded Vmess data:', decodedVmess);
      
      const utf8Decoder = new TextDecoder('utf-8');
      let vmessJson: any;
      try {
        vmessJson = JSON.parse(utf8Decoder.decode(new Uint8Array(decodedVmess.split('').map(char => char.charCodeAt(0)))));
        console.log('Decoded Vmess JSON:', vmessJson);
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError.message);
        return { status: 'error', message: 'Failed to parse Vmess JSON.' };
      }

      const userId = vmessJson.id;
      const remarks = vmessJson.ps || user;

      const response = {
        status: 'success',
        data: {
          remarks,
          domain: DOMAIN,
          nsDNS: HOST,
          portDNS: '443, 53',
          portTLS: '443',
          portNTLS: '80, 8080',
          portGRPC: '443',
          alterId: '0',
          security: 'auto',
          network: '(WS) or (gRPC)',
          path: '/whatever/vmess',
          serviceName: 'vmess-grpc',
          userId: userId,
          pubKey: PUB,
          links: {
            tls: vmessUrls[0].trim(),
            ntls: vmessUrls[1].trim(),
            grpc: vmessUrls[2].trim(),
          },
          formatOpenClash: `https://${DOMAIN}:81/vmess-${user}.txt`,
          expiration: `${exp} Day`
        }
      };

      const message = `
🚀 𝘼𝙠𝙪𝙣 𝙑𝙈𝙀𝙎𝙎 𝘽𝙖𝙧𝙪 𝘼𝙠𝙩𝙞𝙛! 🚀

𝙐𝙨𝙚𝙧𝙣𝙖𝙢𝙚: ${user}  
𝘽𝙚𝙧𝙖𝙠𝙝𝙞𝙧 𝘿𝙖𝙡𝙖𝙢: ${exp} 𝘿𝙖𝙮  
𝙎𝙀𝙍𝙑𝙀𝙍: ${servername}

Terima kasih telah memilih kami!
      `;
      const replyMarkup = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'WEB',
                url: `${UrlWeb}`
              }
            ]
          ]
        }
      };
      bot.sendMessage(chatId, message, replyMarkup);

      return response;
    } catch (error) {
      console.error('Error in createVmess:', error.message);
      return { status: 'error', message: error.message };
    }
  }
}
