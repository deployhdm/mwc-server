import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionLevel } from 'src/enums/permission.enum';
import { NoteCollaborationsService } from 'src/modules/note-collaborations/note-collaborations.service';
import { NotesService } from 'src/modules/notes/services/notes.service';

@Injectable()
export class NoteGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly noteCollaborationsService: NoteCollaborationsService,
    private readonly notesService: NotesService,
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean>  {
    const request = context.switchToHttp().getRequest()
    if (!request.user) {
      throw new UnauthorizedException('User not authenticated')
    }

    const userId = request.user.id 
    const noteId = +request.params.id
    const requiredPermissionLevel = this.reflector.get<PermissionLevel>(PermissionLevel, context.getHandler())

    // For routes without noteId
    if (!noteId) {
      return true
    }

    // If user is owner of the note, has all rights
    const ownerId = await this.notesService.findMemberIdByNoteId(noteId)
    if (ownerId === userId) {
      return true
    }

    const userPermissionLevel = await this.noteCollaborationsService.getPermissionLevelByNoteIdAndMemberId(noteId, userId)
    
    if (userPermissionLevel < requiredPermissionLevel) {
      throw new ForbiddenException('Insufficient permissions to access this resource');
    }
    return true
  }
}
