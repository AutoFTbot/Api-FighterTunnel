import { Controller, Get, Query } from '@nestjs/common';
import { execSync } from 'child_process';
import * as fs from 'fs';

@Controller('api')
export class ApiVlessController {

  @Get('create-vless')
  createVless(@Query('user') user: string, @Query('exp') exp: string, @Query('quota') quota: string, @Query('limitip') limitip: string) {
    try {
      const cmd = `printf '%s\n' '${user}' '${exp}' '${quota}' '${limitip}' | add-vless`;
      const result = execSync(cmd).toString();
      const vlessUrls = result.match(/vless:\/\/[^\s]+/g);

      if (!vlessUrls || vlessUrls.length < 3) {
        return { status: 'error', message: 'No Vless URLs found or insufficient URLs.' };
      }

      const config = fs.readFileSync('/etc/ftvpn/var.txt', 'utf-8').split('\n');
      const DOMAIN = config.find(line => line.startsWith('DOMAIN')).split('=')[1].replace(/"/g, '').trim();
      const PUB = config.find(line => line.startsWith('PUB')).split('=')[1].replace(/"/g, '').trim();
      const HOST = config.find(line => line.startsWith('HOST')).split('=')[1].replace(/"/g, '').trim();

      if (!DOMAIN || !PUB || !HOST) {
        return { status: 'error', message: 'Error fetching configuration data from /etc/ftvpn/var.txt' };
      }

      const vlessUrl = vlessUrls[0].replace('vless://', '').trim();
      const userId = vlessUrl.split('@')[0];
      const remarks = vlessUrl.match(/#(.*)/) ? vlessUrl.match(/#(.*)/)[1] : user;

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
          path: '/whatever/vless',
          serviceName: 'vless-grpc',
          userId,
          pubKey: PUB,
          links: {
            tls: vlessUrls[0].trim(),
            ntls: vlessUrls[1].trim(),
            grpc: vlessUrls[2].trim(),
          },
          formatOpenClash: `https://${DOMAIN}:81/vless-${user}.txt`,
          expiration: `${exp} Day`
        }
      };

      return response;
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}