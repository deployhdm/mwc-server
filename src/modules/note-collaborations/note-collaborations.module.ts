import { forwardRef, Module } from '@nestjs/common';
import { NoteCollaborationsService } from './note-collaborations.service';
import { NoteCollaborationsController } from './note-collaborations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteCollaboration } from './entities/note-collaboration.entity';
import { MembersModule } from '../members/members.module';
import { NotesModule } from '../notes/notes.module';
import { MembersService } from '../members/services/members.service';
import { NotesService } from '../notes/services/notes.service';
import { EmailService } from '../mailer/email.service';
import { PostmarkService } from '../mailer/postmark.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteCollaboration]), 
    MembersModule, 
    forwardRef(() => NotesModule),
  ],
  controllers: [NoteCollaborationsController],
  providers: [NoteCollaborationsService, MembersService, NotesService, EmailService, PostmarkService],
  exports: [TypeOrmModule]
})
export class NoteCollaborationsModule {}
