import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)

  constructor(private readonly authService: AuthService, private reflector: Reflector){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // If the route has a @Public() decorator, isPublic is true
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const tokenParts = request.headers.authorization?.split(' ')
    if (!tokenParts || tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
      this.logger.debug('Token is not in good form')
      throw new UnauthorizedException('Invalid token')
    }

    const token = tokenParts[1]
    try {
      const decoded = this.authService.validateToken(token)
      request.user = decoded
      return true
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Redirect to login page if token is expired
        this.logger.debug('Token is expired')
        throw new UnauthorizedException('Token expired detected in AuthGuard');
      }
      return false
    }
  }
}
