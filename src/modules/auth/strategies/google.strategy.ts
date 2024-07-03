import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { MembersService } from "src/modules/members/services/members.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    private logger = new Logger(GoogleStrategy.name)
    constructor(
        private readonly membersService: MembersService
    ){
        super({
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URI,
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
        this.logger.debug("Entering validate method")
        try {
            const { name, emails, photos } = profile
            const googleUser = {
                email: emails[0].value,
                firstname: name.givenName,
                lastname: name.familyName,
                picture: photos[0].value,
                accessToken: accessToken,
                refreshToken: refreshToken,
            }

            const member = await this.membersService.findByGmail(googleUser.email)

            if (!member) {
                throw new UnauthorizedException('Google sync failed');                
                // this.logger.debug("L'utilisateur n'a pas rentré le même gmail, la synchronisation s'arrête et retour sur le site")
                // return done(null, false, { message: 'Le compte Gmail n\'a pas été trouvé dans la base de données' });
            }

            await this.membersService.addGoogleRefreshToken(member, googleUser.refreshToken)
            await this.membersService.addGoogleAccessToken(member, googleUser.accessToken)

            done(null, googleUser)
        } catch (error) {
            this.logger.debug("Il y a une erreur dans l'authentification Gmail")
            done(error, null)
        }
    }
}