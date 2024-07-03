import { Controller, Get, Post, Body, Param, Delete, Request, UseInterceptors, Logger, Put, Query, UseGuards, SetMetadata } from '@nestjs/common';
import { NotesService } from './services/notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { MembersService } from 'src/modules/members/services/members.service';
import { BaseResponseInterceptor } from 'src/interceptors/base-response.interceptor';
import { NoteCollaborationsService } from '../note-collaborations/note-collaborations.service';
import { CreateNoteCollaborationDto } from '../note-collaborations/dto/create-note-collaboration.dto';
import { NoteGuard } from 'src/guards/note/note.guard';
import { PermissionLevel } from 'src/enums/permission.enum';
import { Note } from './entities/note.entity';

@UseInterceptors(BaseResponseInterceptor)
@UseGuards(NoteGuard)
@Controller('notes')
export class NotesController {
  private logger = new Logger()
  constructor(
    private readonly notesService: NotesService,
    private readonly membersService: MembersService,
    private readonly noteCollaborationsService: NoteCollaborationsService,
  ) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    const userId = req.user.id
    createNoteDto.member = userId
    return await this.notesService.create(createNoteDto)
  }

  @Get()
  async findAllNotesByMemberId(@Request() req){
    const userId = req.user.id
    const notes = await this.membersService.findUserNotes(userId)
    const sharedNotes = await this.noteCollaborationsService.findAllSharedNotesByMemberId(userId)
    const allNotes = [...notes, ...sharedNotes]
    return { notes: allNotes }
  }

  @Post(':id/share')
  @SetMetadata(PermissionLevel, PermissionLevel.WRITE_AND_SHARE)
  async addColloboratorToNote(@Param('id') id: string, @Body() noteCollaboration: CreateNoteCollaborationDto) {
    return await this.noteCollaborationsService.create(+id, noteCollaboration)
  }

  @Get(':id/share')
  @SetMetadata(PermissionLevel, PermissionLevel.WRITE_AND_SHARE)
  async getCollaborators(@Param('id') id: string) {
    const noteCollaborations = await this.noteCollaborationsService.findAllCollborationsByNoteId(+id)
    return { collaborators: noteCollaborations}
  }

  @Delete(':id/share')
  async cancelInvitationCollaborator(@Param('id') id: string, @Query('email') email: string) {
    return await this.noteCollaborationsService.removeByEmailAndNoteId(+id, email)
  }

  @Get(':id')
  @SetMetadata(PermissionLevel, PermissionLevel.READ)
  async findOne(@Param('id') id: string) {
    const note = await this.notesService.findOne(+id)
    return { notes: note } 
  }

  @Put(':id')
  @SetMetadata(PermissionLevel, PermissionLevel.WRITE)
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return await this.notesService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.notesService.remove(+id);
  }

  //search notes of the logged user by keyword
  @Get('search/note')
  async searchNotesByKeyword(@Request() req, @Query('keyword') keyword: string): Promise<Note[]> {
    const userId = req.user.id
    const keywordString = typeof keyword === 'string' ? keyword : '';
    return this.notesService.searchUserNotesByKeyword(userId, keywordString);
  }
}
