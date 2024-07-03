import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateInvitationDto } from 'src/modules/invitations/dto/create-invitation.dto';

@Injectable()
export class FriendsService {
    private logger = new Logger()
    constructor(private readonly membersService: MembersService){}

    async sendFriendshipInvitation(createInvitationDto: CreateInvitationDto): Promise<CreateInvitationDto> {
        const receiver = await this.membersService.findByEmail(createInvitationDto.email)
        this.logger.debug(receiver)

        if (!receiver) {
            this.logger.debug('Throwing error because receiver is ', receiver)
            throw new NotFoundException(`Invitation receiver with email ${ createInvitationDto.email } not found`)
        }

        const sender = await this.membersService.findOne(createInvitationDto.senderId)
        if (!sender) {
            throw new NotFoundException(`Sender with ID ${createInvitationDto.senderId} not found`)
        }

        createInvitationDto.sender = sender
        createInvitationDto.receiver = receiver

        return createInvitationDto
    }

}
