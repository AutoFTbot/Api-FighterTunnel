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
const webName = process.env.WEB;
const UrlWeb = process.env.WEB_URL;
const bot = new TelegramBot(botToken);

@Controller('api')
export class ApiVmessController {

  @Get('create-vmess')
  createVmess(@Query('user') user: string, @Query('exp') exp: string, @Query('quota') quota: string, @Query('limitip') limitip: string) {
    try {
      const cmd = `printf '%s\n' '${user}' '${exp}' '${quota}' '${limitip}' | add-ws`;
      const result = execSync(cmd).toString();
      const vmessUrls = result.match(/vmess:\/\/[^\s]+/g);

      if (!vmessUrls || vmessUrls.length < 3) {
        return { status: 'error', message: 'No Vmess URLs found or insufficient URLs.' };
      }

      const config = fs.readFileSync('/etc/ftvpn/var.txt', 'utf-8').split('\n');
      const DOMAIN = config.find(line => line.startsWith('DOMAIN')).split('=')[1].replace(/"/g, '').trim();
      const PUB = config.find(line => line.startsWith('PUB')).split('=')[1].replace(/"/g, '').trim();
      const HOST = config.find(line => line.startsWith('HOST')).split('=')[1].replace(/"/g, '').trim();

      if (!DOMAIN || !PUB || !HOST) {
        return { status: 'error', message: 'Error fetching configuration data from /etc/ftvpn/var.txt' };
      }

      const decodedVmess = Base64.decode(vmessUrls[0].replace('vmess://', '').trim());
      const utf8Decoder = new TextDecoder('utf-8');
      const vmessJson = JSON.parse(utf8Decoder.decode(new Uint8Array(decodedVmess.split('').map(char => char.charCodeAt(0)))));
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
𝙎𝙀𝙍𝙑𝙀𝙍: ${webName}

Terima kasih telah memilih kami!
    `;
    const replyMarkup = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'WEB',
              url: `${UrlWeb}` // URL yang dituju saat tombol diklik
            }
          ]
        ]
      }
    };
    bot.sendMessage(chatId, message, replyMarkup);

      return response;
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
