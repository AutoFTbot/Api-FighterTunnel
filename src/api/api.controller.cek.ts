import { Controller, Post } from '@nestjs/common';
import { execSync } from 'child_process';

@Controller('api/cek')
export class ApiCekController {

  private checkDatabase(dbPath: string): string[] {
    try {
      const result = execSync(`cat ${dbPath} | grep '###' | cut -d ' ' -f 2 | nl`).toString();
      return result.trim().split('\n').map(line => line.replace(/\t/g, '.').trim());
    } catch (error) {
      console.error(`Error checking database at ${dbPath}: ${error.message}`);
      return [`Error: ${error.message}`];
    }
  }

  @Post('account')
  cekAccount() {
    const dbPaths: Record<string, string> = {
      'TROJAN': '/etc/trojan/.trojan.db',
      'VMESS': '/etc/vmess/.vmess.db',
      'SSH': '/etc/ssh/.ssh.db',
      'VLESS': '/etc/vless/.vless.db',
    };

    const results: Record<string, string[]> = {};
    for (const [key, path] of Object.entries(dbPaths)) {
      results[key] = this.checkDatabase(path);
    }
    console.log('Results:', results);
    return results;
  }
}
