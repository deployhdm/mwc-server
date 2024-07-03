import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleTokenInterceptor } from 'src/interceptors/google-token.interceptor';
import { Event } from '../event.interface';

@Injectable()
@UseInterceptors(GoogleTokenInterceptor)
export class GoogleCalendarService {
    private calendar = google.calendar('v3')
    private logger = new Logger(GoogleCalendarService.name)

    constructor() {
        this.calendar = google.calendar({ version: 'v3'})
    }

    async getEvents(googleAccessToken: string, calendarId: string = 'primary', options: any = {}): Promise<Event[]> {
        try {
            const auth = new google.auth.OAuth2()
            auth.setCredentials({ access_token: googleAccessToken})
            const calendar = google.calendar({ version: 'v3', auth })
            const response = await calendar.events.list({
                calendarId,
                ...options
            })
            this.logger.debug(`Retrieved ${response.data.items.length} google events`)
            return response.data.items
        } catch (error) {
            this.logger.debug('Error fecthing events: ', error)
            throw error
        }
    }
}
