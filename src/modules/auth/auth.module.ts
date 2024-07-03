import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MembersService } from 'src/modules/members/services/members.service';
import { MembersModule } from 'src/modules/members/members.module';
import { TokenGeneratorService } from './token-generator.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { NotepadModule } from '../notepad/notepad.module';
import { NotepadService } from '../notepad/notepad.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { SessionSerializer } from './serializers/session.serializer';
import { ResettokenService } from '../resetToken/resetToken.service';
import { ResettokenModule } from '../resetToken/resetToken.module';
import { EmailService } from '../mailer/email.service';
import { PostmarkService } from '../mailer/postmark.service';
import { NoteCollaborationsService } from '../note-collaborations/note-collaborations.service';
import { NoteCollaborationsModule } from '../note-collaborations/note-collaborations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteCollaboration } from '../note-collaborations/entities/note-collaboration.entity';
import { NotesService } from '../notes/services/notes.service';
import { Note } from '../notes/entities/note.entity';
import { NotesModule } from '../notes/notes.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MembersModule,
    NotepadModule,
    ResettokenModule,
    NoteCollaborationsModule,
    NotesModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET')
      })
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    SessionSerializer,
    AuthService,
    GoogleStrategy,
    MembersService,
    NotepadService,
    TokenGeneratorService,
    ResettokenService,
    EmailService,
    PostmarkService,
    NoteCollaborationsService,
    NotesService,
    JwtService,
  ],
})
export class AuthModule { }
