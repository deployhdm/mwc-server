import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MembersModule } from './modules/members/members.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { NotesModule } from './modules/notes/notes.module';
import { AuthModule } from './modules/auth/auth.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { MeetsModule } from './modules/meets/meets.module';
import { NotepadModule } from './modules/notepad/notepad.module';
import { PassportModule } from '@nestjs/passport';
import { LinksModule } from './modules/links/links.module';
import { GoogleCalendarModule } from './modules/google-calendar/google-calendar.module';
import { NoteCollaborationsModule } from './modules/note-collaborations/note-collaborations.module';
import { ResettokenModule } from './modules/resetToken/resetToken.module';
import { MemberEmailsModule } from './modules/member-emails/member-emails.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/*/.entity.{js,ts}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    PassportModule.register({ session: true }),
    MembersModule,
    TasksModule,
    NotesModule,
    AuthModule,
    InvitationsModule,
    MeetsModule,
    NotepadModule,
    LinksModule,
    GoogleCalendarModule,
    NoteCollaborationsModule,
    ResettokenModule,
    MemberEmailsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule { }
