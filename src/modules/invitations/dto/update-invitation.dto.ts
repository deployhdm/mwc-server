import { PartialType } from '@nestjs/mapped-types';
import { CreateInvitationDto } from './create-invitation.dto';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateInvitationDto extends PartialType(CreateInvitationDto) {
    @IsNotEmpty()
    @IsInt({ message: 'Receiver ID must be an integer' })
    @IsPositive({ message: 'Receiver ID must be a positive integer' })
    receiverId: number

    senderId: number
}
