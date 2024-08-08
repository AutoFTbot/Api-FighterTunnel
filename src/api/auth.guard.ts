import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader === process.env.AUTH_TOKEN) {
      return true;
    } else {
      const response = context.switchToHttp().getResponse();
      response.redirect('https://xnxx.com');
      return false;
    }
  }
}
