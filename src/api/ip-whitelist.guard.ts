import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Redirect } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class IpWhitelistGuard implements CanActivate {
  private readonly allowedIps = ['89.213.211.250', '178.128.119.80']; // Ganti dengan IP yang diizinkan
  private readonly blockedIps = new Set<string>();
  private readonly ipAttempts = new Map<string, number>();

  private readonly maxAttempts = 3;
  private readonly blockDuration = 15 * 60 * 1000;

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const clientIp = (request.ip || (request.headers['x-forwarded-for'] as string)?.split(',')[0].trim()).replace(/^::ffff:/, '');

    console.log('Client IP:', clientIp);
    console.log('Allowed IPs:', this.allowedIps);

    if (this.blockedIps.has(clientIp)) {
      console.log('IP is blocked');
      context.switchToHttp().getResponse().redirect('https://testfile.org/file-1000GB');
      throw new UnauthorizedException('Your IP is temporarily blocked due to multiple failed attempts.');
    }

    if (!this.allowedIps.includes(clientIp)) {
      this.trackAttempt(clientIp);
      if (this.isBlocked(clientIp)) {
        console.log('Unauthorized IP with excessive attempts');
        this.blockedIps.add(clientIp);
        context.switchToHttp().getResponse().redirect('https://testfile.org/file-1000GB');
        throw new UnauthorizedException('Your IP has been temporarily blocked due to multiple failed attempts.');
      }
      console.log('Unauthorized IP');
      throw new UnauthorizedException('YAH SI KONTOL MAU NGAPAIN');
    }

    return true;
  }

  private trackAttempt(ip: string): void {
    const attempts = this.ipAttempts.get(ip) || 0;
    this.ipAttempts.set(ip, attempts + 1);
  }

  private isBlocked(ip: string): boolean {
    const attempts = this.ipAttempts.get(ip) || 0;
    return attempts >= this.maxAttempts;
  }
}
