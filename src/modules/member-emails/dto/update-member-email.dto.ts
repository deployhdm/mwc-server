import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberEmailDto } from './create-member-email.dto';

export class UpdateMemberEmailDto extends PartialType(CreateMemberEmailDto) {}
