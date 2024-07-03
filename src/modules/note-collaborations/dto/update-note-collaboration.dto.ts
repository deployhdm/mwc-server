import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteCollaborationDto } from './create-note-collaboration.dto';

export class UpdateNoteCollaborationDto extends PartialType(CreateNoteCollaborationDto) {}
