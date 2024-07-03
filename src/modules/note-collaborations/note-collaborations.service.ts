import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateNoteCollaborationDto } from './dto/create-note-collaboration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteCollaboration } from './entities/note-collaboration.entity';
import { Repository } from 'typeorm';
import { MembersService } from '../members/services/members.service';
import { NotesService } from '../notes/services/notes.service';
import crypto from 'crypto';
import { PermissionLevel } from 'src/enums/permission.enum';
import { Note } from '../notes/entities/note.entity';
import { NoteDto } from './dto/note.dto';
import { EmailService } from '../mailer/email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class NoteCollaborationsService {
  private logger = new Logger()
  constructor(
    @InjectRepository(NoteCollaboration)
    private readonly noteCollaborationsRepository: Repository<NoteCollaboration>,
    private readonly membersService: MembersService,
    private readonly notesService: NotesService,
    private readonly emailService: EmailService,

  ){}

  createInvitationToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  async create(id: number, createNoteCollaborationDto: CreateNoteCollaborationDto): Promise<NoteCollaboration> {
    const note = await this.notesService.findOne(id)
    if (!note) {
        throw new NotFoundException(`Note with ID ${id} not found`)
    }

    const { email, permissionLevel } = createNoteCollaborationDto
    let member = await this.membersService.findByEmail(email)

    // If email is not in database;
    if (!member) {
      // Create a temporary member in database
      member = await this.membersService.createTemporaryUser(email);
    }
    //create invitationToken
    const token = Math.random().toString(36).substring(7);
    const hashedToken = await bcrypt.hash(token, 10);
    // Create noteCollaboration
    const noteCollaboration = new NoteCollaboration()
    noteCollaboration.member = member
    noteCollaboration.note = note
    noteCollaboration.permissionLevelNumeric = PermissionLevel[permissionLevel.toString()]
    noteCollaboration.invitationToken = hashedToken
    noteCollaboration.isUserRegistered = member.isRegistered

    //send confirmation invite email and encode token
    const encodToken = encodeURIComponent(hashedToken);
    await this.emailService.sendConfirmationInviteEmail(encodToken, email)

    // Increament collaborations number in note based on noteId
    await this.notesService.incrementCollaboratorCount(id)
    return await this.noteCollaborationsRepository.save(noteCollaboration)
  }

  async findAllCollborationsByNoteId(id: number): Promise<NoteCollaboration[]> {
    return await this.noteCollaborationsRepository.find({
      relations: ['note', 'member'],
      where: { note: {id: id} }
    })
  }

  async findAllSharedNotesByMemberId(id: number): Promise<NoteDto[]> {
    const noteCollaborations = await this.noteCollaborationsRepository.find({
      relations: ['note', 'member'],
      where: { member: {id: id}}
    })
    const sharedNotesWithPermission: { note: Note; permissionLevel: string }[] = noteCollaborations.map(noteCollab => ({
      note: noteCollab.note,
      permissionLevel: PermissionLevel[noteCollab.permissionLevelNumeric]
    }))

    const sharedNotesIds = noteCollaborations.map(noteCollab => noteCollab.note.id)
    const sharedNotes = await this.notesService.findSubsetIds(sharedNotesIds)
    const sharedNotesWithPermissionLevel: NoteDto[] = sharedNotes.map(note => {
      const { member, ...noteWithoutMember } = note
      const entry = sharedNotesWithPermission.find(entry => entry.note.id === note.id)
      if (entry) {
        return { ...noteWithoutMember, permissionLevel: entry.permissionLevel}
      }
    })
    return sharedNotesWithPermissionLevel
  }

  async findByNoteIdAndMemberId(noteId: number, userId: number): Promise<NoteCollaboration> {
    return await this.noteCollaborationsRepository.findOne({
      relations: ['note', 'member'],
      where: {
        note: {id: noteId},
        member: {id: userId}
      }
    })
  }

  async getPermissionLevelByNoteIdAndMemberId(noteId: number, userId: number): Promise<PermissionLevel> {
    const noteCollaboration = await this.noteCollaborationsRepository.findOne({
      relations: ['note', 'member'],
      where: {
        note: {id: noteId},
        member: {id: userId}
      }
    })
    if (!noteCollaboration) {
      throw new ForbiddenException(`You cannot access this ressource` )
    }
    return noteCollaboration.permissionLevelNumeric
  }

  async removeByEmailAndNoteId(id: number, email: string): Promise<boolean> {
    try {
      const noteCollaboration = await this.noteCollaborationsRepository.findOne({
        relations: ['member', 'note'],
        where: {
          member: { email: email },
          note: { id: id}
        }
      })
      if (!noteCollaboration) {
        throw new NotFoundException(`Cannot find NoteCollaboration with ${email}`)
      }
      await this.noteCollaborationsRepository.remove(noteCollaboration)
      await this.notesService.decrementCollaboratorCount(id)
      return true 
    } catch (error) {
      throw error 
    }
  }

  // get the member id by the token of the note collab
  async getMemberIdByInvitationToken(token: string): Promise<NoteCollaboration> {
    try {
      const noteCollab = await this.noteCollaborationsRepository.findOne({
        where: {
          invitationToken: token,
        },
        relations: ['member']
      });      
      if (!noteCollab) {
        throw new NotFoundException(`Cannot find NoteCollaboration with token ${token}`);
      }
      return noteCollab;
    } catch (error) {
      throw new InternalServerErrorException('Can not get the information ' + error.message);
    }
  }

  // update register member status in the collab note
  async updatenoteCollabRegisterStatus(id:number) {
    try {
      const noteCollab = await this.noteCollaborationsRepository.findOne({
        where:{
          id : id
        }
      })
      if (!noteCollab) {
        throw new NotFoundException(`Cannot find NoteCollaboration with id` + id)
      }
      noteCollab.isUserRegistered = true
      await this.noteCollaborationsRepository.save(noteCollab);
    } catch(error){
      throw new InternalServerErrorException('Can not update note collaboration status '+error.message)
    }
  }
}
