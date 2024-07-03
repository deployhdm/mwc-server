import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { MembersService } from 'src/modules/members/services/members.service';

@Injectable()
export class GoogleTokenService {
    private logger = new Logger(GoogleTokenService.name)
    constructor(
        private readonly membersService: MembersService,
    ){}

    async verifyGoogleToken(id: number){
        this.logger.debug('Verifying google access token validity...')
        try {
            const accessToken = this.membersService.getGoogleAccessToken(id)
            if (!accessToken) {
                this.logger.debug('User has not authenticated Gmail account')
            }
            const url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken;
            const res = await axios.get(url)
    
            if (res.data.error) {
                throw new UnauthorizedException('Invalid access token');
            }
        } catch (error) {
            this.logger.debug('Google token expired')
            throw new UnauthorizedException('Failed to verify access token')
        }
    }

    async refreshGoogleToken(id: number): Promise<string> {
        this.logger.debug('Fetching new google access token...')
        try {
            const refreshToken = await this.membersService.getGoogleRefreshToken(id)
            const res = await axios.post('https://oauth2.googleapis.com/token', null, {
                params: {
                    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
                    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                    refresh_token: refreshToken,
                    grant_type: 'refresh_token'
                },
            })
    
            const { access_token } = res.data 
            this.logger.debug(`New access token fetched: `)
            return access_token
        } catch (error) {
            this.logger.error(error)
            throw error
        }
    }

    async updateGoogleAccessToken(id: number): Promise<string> {
        this.logger.debug('Updating google access token in base...')
        const accessToken = await this.refreshGoogleToken(id)
        await this.membersService.updateGoogleAccessToken(id, accessToken)
        return accessToken
    }
}
