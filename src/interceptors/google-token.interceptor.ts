import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { catchError, from, Observable, switchMap } from 'rxjs';
import { GoogleTokenService } from 'src/modules/google-calendar/services/google-token/google-token.service';
import { MembersService } from 'src/modules/members/services/members.service';

@Injectable()
export class GoogleTokenInterceptor implements NestInterceptor {
  private logger = new Logger(GoogleTokenInterceptor.name)
  constructor(
    private readonly googleTokenService: GoogleTokenService,
    private readonly membersService: MembersService,
  ){}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    this.logger.debug('Entering GoogleTokenInterceptor...')
    const request = context.switchToHttp().getRequest()
    const userId = request.user.id
    const accessToken = await this.membersService.getGoogleAccessToken(userId)

    if (!accessToken) {
      this.logger.debug('User does not have an Google access token. Proceed without Google Meet intefgration')
      return next.handle()
    }

    return from(this.googleTokenService.verifyGoogleToken(userId)).pipe(
      catchError(err => {
        if (err instanceof UnauthorizedException) {
          // Token is invalid, refresh it
          return from(this.googleTokenService.updateGoogleAccessToken(userId)).pipe(
            switchMap((newToken) => {
              return next.handle()
            })
          )
        }
      }),
      switchMap(() => next.handle())
    )
  }
}
