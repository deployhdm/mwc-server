import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './services/google-calendar.service';
import { GoogleTokenService } from './services/google-token/google-token.service';
import { MembersModule } from '../members/members.module';
import { MembersService } from '../members/services/members.service';

@Module({
    imports: [MembersModule],
    providers: [GoogleCalendarService, GoogleTokenService, MembersService],
})
export class GoogleCalendarModule {}
