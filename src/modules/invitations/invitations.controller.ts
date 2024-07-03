import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Request, UseInterceptors } from "@nestjs/common";
import { InvitationsService } from "./invitations.service";
import { MembersService } from "../members/services/members.service";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { UpdateInvitationDto } from "./dto/update-invitation.dto";
import { BaseResponseInterceptor } from "src/interceptors/base-response.interceptor";
import { Invitation } from "./entities/invitation.entity";

@UseInterceptors(BaseResponseInterceptor)
@Controller('friends')
export class InvitationsController {
    private logger = new Logger()
    constructor(
        private readonly invitationsService: InvitationsService,
        private readonly membersService: MembersService
    ){}

    // INVITATION RELATED ROUTES
    @Get('invitation')
    async findAllInvitations(@Request() req) {
        const userId = req.user.id
        const sentInvitations:Invitation[] = await this.membersService.findUserSentInvitations(userId)
        const receivedInvitations: Invitation[] = await this.membersService.findUserReceivedInvitations(userId)
        return {
            receive: receivedInvitations.map(i => i.sender),
            send: sentInvitations,
        }
    }

    @Post('invitation')
    async sendInvitation(@Request() req, @Body() createInvitationDto: CreateInvitationDto){
        const userId = req.user.id
        createInvitationDto.senderId = userId
        return await this.invitationsService.sendInvitation(createInvitationDto)
    }

    @Put('invitation/:id')
    async acceptInvitation(@Request() req, @Param('id') id: string) {
        const userId = req.user.id
        const updateInvitationDto = new UpdateInvitationDto()
        updateInvitationDto.receiverId = userId
        updateInvitationDto.senderId = +id
        return await this.invitationsService.acceptInvitation(updateInvitationDto) 
    }

    @Post('invitation/:id')
    async refuseInvitation(@Request() req, @Param('id') id: string){
        const userId = req.user.id
        const updateInvitationDto = new UpdateInvitationDto()
        updateInvitationDto.receiverId = userId
        updateInvitationDto.senderId = +id
        return await this.invitationsService.refuseInvitation(updateInvitationDto)
    }

    @Delete('invitation/:id')
    async deleteInvitation(@Request() req, @Param('id') id: string) {
        const userId = req.user.id
        const updateInvitationDto = new UpdateInvitationDto()
        updateInvitationDto.receiverId = +id
        updateInvitationDto.senderId = userId
        await this.invitationsService.deleteInvitation(updateInvitationDto)
        return 'Deletion completed'
    }

    // FRIENDS RELATED ROUTES
    @Get()
    async getAllFriends(@Request() req){
        const userId = req.user.id
        const friends =  await this.membersService.findUserFriends(userId)
        return { friends: friends}
    }

    @Delete(':id')
    async deleteFriendship(@Request() req, @Param('id') id: string) {
        const userId = req.user.id
        const updateInvitationDto = new UpdateInvitationDto()
        updateInvitationDto.receiverId = userId
        updateInvitationDto.senderId = +id
        return await this.membersService.deleteFriendship(updateInvitationDto)
    }

}