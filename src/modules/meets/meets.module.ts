import { Module } from '@nestjs/common';
import { MeetsService } from './meets.service';
import { MeetsController } from './meets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meet } from './entities/meet.entity';
import { MembersModule } from '../members/members.module';
import { MembersService } from '../members/services/members.service';
import { GoogleCalendarModule } from '../google-calendar/google-calendar.module';
import { GoogleCalendarService } from '../google-calendar/services/google-calendar.service';
import { GoogleTokenService } from '../google-calendar/services/google-token/google-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meet]), MembersModule, GoogleCalendarModule],
  controllers: [MeetsController],
  providers: [MeetsService, MembersService, GoogleCalendarService, GoogleTokenService],
  exports: [TypeOrmModule]
})
export class MeetsModule {}
