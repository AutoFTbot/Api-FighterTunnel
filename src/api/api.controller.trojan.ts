import { Controller, Get, Query } from '@nestjs/common';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import TelegramBot = require('node-telegram-bot-api');

// Memuat variabel lingkungan dari file .env
dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const webName = process.env.WEB;
const UrlWeb = process.env.WEB_URL;
const bot = new TelegramBot(botToken);

@Controller('api')
export class ApiTrojanController {

  @Get('create-trojan')
  async createTrojan(@Query('user') user: string, @Query('exp') exp: string, @Query('quota') quota: string, @Query('limitip') limitip: string) {
    return new Promise((resolve, reject) => {
      try {
        const config = fs.readFileSync('/etc/ftvpn/var.txt', 'utf-8').split('\n');
        const DOMAIN = config.find(line => line.startsWith('DOMAIN')).split('=')[1].replace(/"/g, '').trim();
        const HOST = config.find(line => line.startsWith('HOST')).split('=')[1].replace(/"/g, '').trim();
        const PUB = config.find(line => line.startsWith('PUB')).split('=')[1].replace(/"/g, '').trim();
        const cmd = `printf '%s\n' '${user}' '${exp}' '${quota}' '${limitip}' | add-tr`;

        const child = spawn('sh', ['-c', cmd]);

        let result = '';
        let error = '';

        child.stdout.on('data', (data) => {
          result += data.toString();
        });

        child.stderr.on('data', (data) => {
          error += data.toString();
        });

        child.on('close', (code) => {
          if (code !== 0) {
            return resolve({ status: 'error', message: error });
          }

          const trojanUrls = result.match(/trojan:\/\/(.*)/g);
          if (!trojanUrls || trojanUrls.length < 2) {
            return resolve({ status: 'error', message: 'Failed to create Trojan account or insufficient URLs returned' });
          }
          
          const uuid = trojanUrls[0].match(/trojan:\/\/(.*)@/)[1];
          const response = {
            status: 'success',
            data: {
              remarks: user,
              domain: DOMAIN,
              nsDNS: HOST,
              portDNS: '443, 53',
              portTLS: '443',
              portNTLS: '80, 8080',
              pathWS: '/whatever/trojan-ws',
              userId: uuid,
              pubKey: PUB,
              links: {
                ws: trojanUrls[0].replace(' ', ''),
                grpc: trojanUrls[1].replace(' ', ''),
              },
              formatOpenClash: `https://${DOMAIN}:81/trojan-${user}.txt`,
              expiration: `${exp} Day`
            }
          };
          const message = `
🚀 𝘼𝙠𝙪𝙣 𝙏𝙍𝙊𝙅𝘼𝙉 𝘽𝙖𝙧𝙪 𝘼𝙠𝙩𝙞𝙛! 🚀

𝙐𝙨𝙚𝙧𝙣𝙖𝙢𝙚: ${user}  
𝘽𝙚𝙧𝙖𝙠𝙝𝙞𝙧 𝘿𝙖𝙡𝙖𝙢: ${exp} 𝘿𝙖𝙮  
𝙒𝙚𝙗𝙨𝙞𝙩𝙚: ${webName}

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
    

          resolve(response);
        });
      } catch (error) {
        resolve({ status: 'error', message: error.message });
      }
    });
  }
}
