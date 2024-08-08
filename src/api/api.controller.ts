import { Controller, Get, Query } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';

@Controller('api')
export class ApiController {

  @Get('backend')
  getBackend() {
    return new Promise((resolve) => {
      exec('cat /usr/bin/backend', (error, stdout, stderr) => {
        if (error) {
          resolve({ error: `Error: ${error.message}` });
        } else if (stderr) {
          resolve({ error: `Stderr: ${stderr}` });
        } else {
          resolve({ result: stdout });
        }
      });
    });
  }

  @Get('create-vmess')
  async createVmess(@Query('user') user: string, @Query('exp') exp: string, @Query('quota') quota: string, @Query('limitip') limitip: string) {
    try {
      const cmd = `printf '%s\n' '${user}' '${exp}' '${quota}' '${limitip}' | add-ws`;
      const result = await execPromise(cmd);
      const vmessUrls = result.match(/vmess:\/\/[^\s]+/g);

      if (!vmessUrls || vmessUrls.length < 3) {
        return { error: "No Vmess URLs found or insufficient URLs." };
      }

      const config = parseConfig('/etc/ftvpn/var.txt');
      if (!config.DOMAIN || !config.PUB || !config.HOST) {
        return { error: "Error fetching configuration data from /etc/ftvpn/var.txt" };
      }

      const vmessUrl = vmessUrls[0].replace('vmess://', '').trim();
      const userId = vmessUrl.split('@')[0];
      const remarks = vmessUrl.match(/#(.*)/)?.[1] || user;

      const response = {
        message: 'Vmess account created successfully',
        data: {
          remarks,
          domain: config.DOMAIN,
          nsDNS: config.HOST,
          ports: {
            dns: '443, 53',
            tls: '443',
            ntls: '80, 8080',
            grpc: '443'
          },
          path: '/whatever/vmess',
          serviceName: 'vmess-grpc',
          userId,
          pubKey: config.PUB,
          links: {
            tls: vmessUrls[0].replace(" ", "").trim(),
            ntls: vmessUrls[1].replace(" ", "").trim(),
            grpc: vmessUrls[2].replace(" ", "").trim()
          },
          openClashFormat: `https://${config.DOMAIN}:81/vmess-${user}.txt`,
          expiration: `${exp} Day`
        }
      };

      return response;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('adduser/exp')
  async addUserExp(@Query('user') user: string, @Query('password') password: string, @Query('exp') exp: string) {
    try {
      const limitip = '2'; // Setting limitip to 2
      const cmd = `printf '%s\n' '${user}' '${password}' '${exp}' '${limitip}' | add-ssh`;
      await execPromise(cmd);

      const config = parseConfig('/etc/ftvpn/var.txt');
      if (!config.DOMAIN || !config.PUB || !config.HOST) {
        return { error: "Error fetching configuration data from /etc/ftvpn/var.txt" };
      }

      const response = {
        message: 'SSH OVPN account created successfully',
        data: {
          username: user,
          password,
          domain: config.DOMAIN,
          hostSlowdns: config.HOST,
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
            squid: '3128',
            badVPNUDP: '7100, 7200, 7300'
          },
          pubKey: config.PUB,
          payloadWSS: `GET wss://BUG.COM/ HTTP/1.1[crlf]Host: ${config.DOMAIN}[crlf]Upgrade: websocket[crlf][crlf]`,
          openVPNLink: `https://${config.DOMAIN}:81`,
          accountLink: `https://${config.DOMAIN}:81/ssh-${user}.txt`,
          expiration: `${exp} Day`
        }
      };

      return response;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('trojan-create')
  async createTrojan(@Query('user') user: string, @Query('exp') exp: string, @Query('quota') quota: string, @Query('limitip') limitip: string) {
    try {
      const config = parseConfig('/etc/ftvpn/var.txt');
      if (!config.DOMAIN || !config.PUB || !config.HOST) {
        return { error: "Error fetching configuration data from /etc/ftvpn/var.txt" };
      }

      const cmd = `printf '%s\n' '${user}' '${exp}' '${quota}' '${limitip}' | add-tr`;
      const result = await execPromise(cmd);
      const trojanUrls = result.match(/trojan:\/\/(.*)/g);

      if (!trojanUrls || trojanUrls.length < 2) {
        return { error: 'Failed to create Trojan account or insufficient URLs returned' };
      }

      const uuid = trojanUrls[0].match(/trojan:\/\/(.*)@/)?.[1];
      const remarks = user;
      const expiration = `${exp} Day`;

      const response = {
        message: 'Trojan account created successfully',
        data: {
          remarks,
          domain: config.DOMAIN,
          nsDNS: config.HOST,
          ports: {
            dns: '443, 53',
            tls: '443',
            ntls: '80, 8080'
          },
          path: '/whatever/trojan-ws',
          userId: uuid,
          pubKey: config.PUB,
          links: {
            ws: trojanUrls[0].replace(' ', ''),
            grpc: trojanUrls[1].replace(' ', '')
          },
          openClashFormat: `https://${config.DOMAIN}:81/trojan-${user}.txt`,
          expiration
        }
      };

      return response;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('vless-create')
  async createVless(@Query('user') user: string, @Query('exp') exp: string, @Query('quota') quota: string, @Query('limitip') limitip: string) {
    try {
      const config = parseConfig('/etc/ftvpn/var.txt');
      if (!config.DOMAIN || !config.PUB || !config.HOST) {
        return { error: "Error fetching configuration data from /etc/ftvpn/var.txt" };
      }

      const cmd = `printf '%s\n' '${user}' '${exp}' '${quota}' '${limitip}' | add-vless`;
      const result = await execPromise(cmd);
      const vlessUrls = result.match(/vless:\/\/(.*)/g);

      if (!vlessUrls || vlessUrls.length < 2) {
        return { error: 'Failed to create Vless account or insufficient URLs returned' };
      }

      const uuid = vlessUrls[0].match(/vless:\/\/(.*)@/)?.[1];
      const remarks = user;
      const expiration = `${exp} Day`;

      const response = {
        message: 'Vless account created successfully',
        data: {
          remarks,
          domain: config.DOMAIN,
          nsDNS: config.HOST,
          ports: {
            dns: '443, 53',
            tls: '443',
            ntls: '80, 8080',
            grpc: '443'
          },
          path: '/whatever/vless',
          serviceName: 'vless-grpc',
          userId: uuid,
          pubKey: config.PUB,
          links: {
            tls: vlessUrls[0].replace(' ', ''),
            ntls: vlessUrls[1].replace(' ', ''),
            grpc: vlessUrls[2].replace(' ', '')
          },
          openClashFormat: `https://${config.DOMAIN}:81/vless-${user}.txt`,
          expiration
        }
      };

      return response;
    } catch (error) {
      return { error: error.message };
    }
  }
}

// Helper function to execute shell commands and return a Promise
function execPromise(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error: ${error.message}`));
      } else if (stderr) {
        reject(new Error(`Stderr: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

// Helper function to parse configuration from a file
function parseConfig(filePath: string): any {
  const configData = fs.readFileSync(filePath, 'utf-8');
  const config: any = {};
  configData.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      config[key.trim()] = value.trim();
    }
  });
  return config;
}
