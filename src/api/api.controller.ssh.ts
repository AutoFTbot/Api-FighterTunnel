import { Controller, Get, Query } from '@nestjs/common';
import { execSync } from 'child_process';
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
export class ApiSSHController {

  @Get('adduser/exp')
  addUserExp(@Query('user') user: string, @Query('password') password: string, @Query('exp') exp: string) {
    try {
      const limitip = '2';
      const cmd = `printf '%s\n' '${user}' '${password}' '${exp}' '${limitip}' | add-ssh`;
      const result = execSync(cmd).toString();
      const config = fs.readFileSync('/etc/ftvpn/var.txt', 'utf-8').split('\n');
      const DOMAIN = config.find(line => line.startsWith('DOMAIN')).split('=')[1].replace(/"/g, '').trim();
      const PUB = config.find(line => line.startsWith('PUB')).split('=')[1].replace(/"/g, '').trim();
      const HOST = config.find(line => line.startsWith('HOST')).split('=')[1].replace(/"/g, '').trim();
      if (!DOMAIN || !PUB || !HOST) {
        return { status: 'error', message: 'Error fetching configuration data from /etc/ftvpn/var.txt' };
      }

      const response = {
        status: 'success',
        data: {
          username: user,
          password: password,
          host: DOMAIN,
          hostSlowdns: HOST,
          ports: {
            openSSH: '443, 80, 22',
            udpSSH: '1-65535',
            dns: '443, 53, 22',
            dropbear: '443, 109',
            dropbearWS: '443, 109',
            sshWS: '80, 8080',
            sshSSLWS: '443',
            sslTLS: '443',
            ovpnWSSSL: '443',
            ovpnSSL: '443',
            ovpnTCP: '443, 1194',
            ovpnUDP: '2200',
            squidProxy: '3128',
            badVPNUDP: '7100, 7300, 7300',
          },
          pubKey: PUB,
          payloadWSS: `GET wss://BUG.COM/ HTTP/1.1[crlf]Host: ${DOMAIN}[crlf]Upgrade: websocket[crlf][crlf]`,
          links: {
            openVPN: `https://${DOMAIN}:81`,
            accountLink: `https://${DOMAIN}:81/ssh-${user}.txt`,
          },
          expiration: `${exp} Day`
        }
      };

      const message = `
🚀 𝘼𝙠𝙪𝙣 𝙎𝙎𝙃 𝘽𝙖𝙧𝙪 𝘼𝙠𝙩𝙞𝙛! 🚀

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


      return response;
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
