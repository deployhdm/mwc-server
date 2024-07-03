import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NoteCollaborationsService } from './note-collaborations.service';
import { CreateNoteCollaborationDto } from './dto/create-note-collaboration.dto';
import { UpdateNoteCollaborationDto } from './dto/update-note-collaboration.dto';

@Controller('note-collaborations')
export class NoteCollaborationsController {
  constructor(private readonly noteCollaborationsService: NoteCollaborationsService) {}

}
