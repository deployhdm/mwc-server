import { Module } from '@nestjs/common';
import { NotesService } from './services/notes.service';
import { NotesController } from './notes.controller';
import { MembersService } from 'src/modules/members/services/members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { MembersModule } from 'src/modules/members/members.module';
import { AuthService } from 'src/modules/auth/auth.service';
import { NoteCollaborationsModule } from '../note-collaborations/note-collaborations.module';
import { NoteCollaborationsService } from '../note-collaborations/note-collaborations.service';
import { ResettokenService } from '../resetToken/resetToken.service';
import { ResettokenModule } from '../resetToken/resetToken.module';
import { PostmarkService } from '../mailer/postmark.service';
import { EmailService } from '../mailer/email.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';



@Module({
  imports: [
    TypeOrmModule.forFeature([Note]), 
    MembersModule,
    NoteCollaborationsModule,
    ResettokenModule,
  ],
  controllers: [NotesController],
  providers: [
    NotesService, 
    MembersService, 
    AuthService, 
    NoteCollaborationsService,
    ResettokenService,
    PostmarkService,
    EmailService,
    JwtService,
    ConfigService,
    PostmarkService,
    EmailService
  ],
  exports: [TypeOrmModule]
})
export class NotesModule { }
