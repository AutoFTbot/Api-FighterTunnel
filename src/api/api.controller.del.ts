import { Controller, Delete, Query } from '@nestjs/common';
import { execSync } from 'child_process';

@Controller('api')
export class ApiDelController {

  private getUserIndex(users: string[], user: string): number | undefined {
    return users.findIndex(u => u.includes(user)) + 1; // +1 to match nl output
  }

  private getUserList(dbPath: string): string[] {
    const listCmd = `grep -E "^### " "${dbPath}" | cut -d ' ' -f 2-3`;
    return execSync(listCmd).toString().trim().split('\n');
  }

  private formatUserList(users: string[]): string {
    return users.map((u, index) => `${index + 1}) ${u}`).join('\n');
  }

  @Delete('delssh')
  listAndDeleteSSH(@Query('user') user?: string) {
    const dbPath = "/etc/ssh/.ssh.db";
    let sshUsers = this.getUserList(dbPath);
    let listResult = this.formatUserList(sshUsers);

    if (user) {
      const index = this.getUserIndex(sshUsers, user);
      if (index) {
        const deleteCmd = `printf "%s\n" "${index}" | del-ssh`;
        execSync(deleteCmd);
        sshUsers = this.getUserList(dbPath);
        listResult = this.formatUserList(sshUsers);
        return {
          message: `Deleted user: ${user}`,
          sshUsers: listResult.split('\n')
        };
      } else {
        return { error: "User not found." };
      }
    }

    return {
      message: "SSH users:",
      sshUsers: listResult.split('\n')
    };
  }

  @Delete('delvmess')
  listAndDeleteVmess(@Query('user') user?: string) {
    const dbPath = "/etc/vmess/.vmess.db";
    let vmessUsers = this.getUserList(dbPath);
    let listResult = this.formatUserList(vmessUsers);

    if (user) {
      const index = this.getUserIndex(vmessUsers, user);
      if (index) {
        const deleteCmd = `printf "%s\n" "${index}" | del-ws`;
        execSync(deleteCmd);
        vmessUsers = this.getUserList(dbPath);
        listResult = this.formatUserList(vmessUsers);
        return {
          message: `Deleted user: ${user}`,
          vmessUsers: listResult.split('\n')
        };
      } else {
        return { error: "User not found." };
      }
    }

    return {
      message: "VMESS users:",
      vmessUsers: listResult.split('\n')
    };
  }

  @Delete('deltrojan')
  listAndDeleteTrojan(@Query('user') user?: string) {
    const dbPath = "/etc/trojan/.trojan.db";
    let trojanUsers = this.getUserList(dbPath);
    let listResult = this.formatUserList(trojanUsers);

    if (user) {
      const index = this.getUserIndex(trojanUsers, user);
      if (index) {
        const deleteCmd = `printf "%s\n" "${index}" | del-tr`;
        execSync(deleteCmd);
        trojanUsers = this.getUserList(dbPath);
        listResult = this.formatUserList(trojanUsers);
        return {
          message: `Deleted user: ${user}`,
          trojanUsers: listResult.split('\n')
        };
      } else {
        return { error: "User not found." };
      }
    }

    return {
      message: "TROJAN users:",
      trojanUsers: listResult.split('\n')
    };
  }

  @Delete('delvless')
  listAndDeleteVless(@Query('user') user?: string) {
    const dbPath = "/etc/vless/.vless.db";
    let vlessUsers = this.getUserList(dbPath);
    let listResult = this.formatUserList(vlessUsers);

    if (user) {
      const index = this.getUserIndex(vlessUsers, user);
      if (index) {
        const deleteCmd = `printf "%s\n" "${index}" | del-vless`;
        execSync(deleteCmd);
        vlessUsers = this.getUserList(dbPath);
        listResult = this.formatUserList(vlessUsers);
        return {
          message: `Deleted user: ${user}`,
          vlessUsers: listResult.split('\n')
        };
      } else {
        return { error: "User not found." };
      }
    }

    return {
      message: "VLESS users:",
      vlessUsers: listResult.split('\n')
    };
  }
}
