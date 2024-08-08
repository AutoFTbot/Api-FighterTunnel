import { Controller, Get } from '@nestjs/common';
import { execSync } from 'child_process';
import * as fs from 'fs';

@Controller('api/trial')
export class ApiTrialController {

  @Get('ssh')
  trialSsh() {
    try {
      const result = execSync(`printf '%s\n' '60' | trial-ssh`).toString();
      const user = result.match(/trial(.*)\n/)?.[0]?.replace('\n', '');
      const password = result.match(/Password\s+:\s+(.*)\n/)?.[1];

      if (!user || !password) {
        return { error: "Error fetching trial SSH credentials." };
      }

      const config = fs.readFileSync('/etc/ftvpn/var.txt', 'utf-8').split('\n');
      const DOMAIN = config.find(line => line.startsWith('DOMAIN')).split('=')[1].replace(/"/g, '').trim();
      const PUB = config.find(line => line.startsWith('PUB')).split('=')[1].replace(/"/g, '').trim();
      const HOST = config.find(line => line.startsWith('HOST')).split('=')[1].replace(/"/g, '').trim();

      if (!DOMAIN || !PUB || !HOST) {
        return { error: "Error fetching configuration data from /etc/ftvpn/var.txt" };
      }

      const response = {
        message: "SSH OVPN Account",
        user: user.trim(),
        password: password.trim(),
        host: DOMAIN,
        hostSlowdns: HOST,
        ports: {
          openSSH: "443, 80, 22",
          udpSSH: "1-65535",
          dropbear: "443, 109",
          sslTLS: "443",
        },
        pubKey: PUB,
        expiredUntil: "60 Minutes",
        linkAccount: `https://${DOMAIN}:81/ssh-${user.trim()}.txt`,
      };

      return response;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('vmess')
  trialVmess() {
    try {
      const result = execSync(`printf '%s\n' '60' | trial-ws`).toString();
      const vmessUrls = result.match(/vmess:\/\/(.*)/g);

      if (!vmessUrls) {
        return { error: "No Vmess URLs found." };
      }

      const config = fs.readFileSync('/etc/ftvpn/var.txt', 'utf-8').split('\n');
      const PUB = config.find(line => line.startsWith('PUB')).split('=')[1].replace(/"/g, '').trim();
      const HOST = config.find(line => line.startsWith('HOST')).split('=')[1].replace(/"/g, '').trim();

      if (!PUB || !HOST) {
        return { error: "Error fetching configuration data from /etc/ftvpn/var.txt" };
      }

      const decodedVmess = Buffer.from(vmessUrls[0].replace('vmess://', ''), 'base64').toString('utf8');
      const z = JSON.parse(decodedVmess);

      const response = {
        message: "Xray/Vmess Account",
        remarks: z["ps"],
        domain: z["add"],
        hostDns: HOST,
        userId: z["id"],
        pubKey: PUB,
        links: {
          tls: vmessUrls[0].replace(" ", "").trim(),
          ntls: vmessUrls[1].replace(" ", "").trim(),
          grpc: vmessUrls[2].trim(),
        },
        expiredUntil: "60 Minutes",
      };

      return response;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('trojan')
  trialTrojan() {
    try {
      const result = execSync(`printf '%s\n' '60' | trial-tr`).toString();
      const trojanUrls = result.match(/trojan:\/\/[^\s]+/g);

      if (!trojanUrls || trojanUrls.length < 2) {
        return { error: "No Trojan URLs found or insufficient URLs." };
      }

      const config = fs.readFileSync('/etc/ftvpn/var.txt', 'utf-8').split('\n');
      const DOMAIN = config.find(line => line.startsWith('DOMAIN')).split('=')[1].replace(/"/g, '').trim();
      const PUB = config.find(line => line.startsWith('PUB')).split('=')[1].replace(/"/g, '').trim();
      const HOST = config.find(line => line.startsWith('HOST')).split('=')[1].replace(/"/g, '').trim();

      if (!DOMAIN || !PUB || !HOST) {
        return { error: "Error fetching configuration data from /etc/ftvpn/var.txt" };
      }

      const trojanUrl = trojanUrls[0].replace('trojan://', '').trim();
      const urlParts = trojanUrl.split('@');
      const uuid = urlParts[0];
      const domainParts = urlParts[1].split(':');
      const domain = domainParts[0];
      const remarksMatch = trojanUrl.match(/#(.*)/);
      const remarks = remarksMatch ? remarksMatch[1] : 'Trojan User';

      const response = {
        message: "Xray/Trojan Account",
        remarks: remarks,
        domain: domain,
        hostDns: HOST,
        userId: uuid,
        pubKey: PUB,
        links: {
          ws: trojanUrls[0].replace(" ", "").trim(),
          grpc: trojanUrls[1].replace(" ", "").trim(),
        },
        expiredUntil: "60 Minutes",
      };

      return response;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('vless')
  trialVless() {
    try {
      const result = execSync(`printf '%s\n' '60' | trial-vl`).toString();
      const vlessUrls = result.match(/vless:\/\/[^\s]+/g);

      if (!vlessUrls || vlessUrls.length < 3) {
        return { error: "No Vless URLs found or insufficient URLs." };
      }

      const config = fs.readFileSync('/etc/ftvpn/var.txt', 'utf-8').split('\n');
      const DOMAIN = config.find(line => line.startsWith('DOMAIN')).split('=')[1].replace(/"/g, '').trim();
      const PUB = config.find(line => line.startsWith('PUB')).split('=')[1].replace(/"/g, '').trim();
      const HOST = config.find(line => line.startsWith('HOST')).split('=')[1].replace(/"/g, '').trim();

      if (!DOMAIN || !PUB || !HOST) {
        return { error: "Error fetching configuration data from /etc/ftvpn/var.txt" };
      }

      const vlessUrl = vlessUrls[0].replace('vless://', '').trim();
      const urlParts = vlessUrl.split('@');
      const uuid = urlParts[0];
      const domainParts = urlParts[1].split(':');
      const domain = domainParts[0];
      const remarksMatch = vlessUrl.match(/#(.*)/);
      const remarks = remarksMatch ? remarksMatch[1] : 'Vless User';

      const response = {
        message: "Xray/Vless Account",
        remarks: remarks,
        domain: domain,
        hostDns: HOST,
        userId: uuid,
        pubKey: PUB,
        links: {
          tls: vlessUrls[0].replace(" ", "").trim(),
          ntls: vlessUrls[1].replace(" ", "").trim(),
          grpc: vlessUrls[2].replace(" ", "").trim(),
        },
        expiredUntil: "60 Minutes",
      };

      return response;
    } catch (error) {
      return { error: error.message };
    }
  }
}
