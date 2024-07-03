import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    private logger = new Logger(GoogleAuthGuard.name)

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()

        try {
            this.logger.debug('Entering google auth guard')
            const activate = await super.canActivate(context) as boolean
            await super.logIn(request)
            this.logger.debug('User logged in');
            return activate
        } catch (error) {
            this.logger.error("Error in canActivate:", error)
            return false
        }
    }

    getAuthenticateOptions(context: ExecutionContext): any {
        return {
            scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar.events.readonly'],
            accessType: 'offline',
            prompt: 'consent',
        }
    }
}