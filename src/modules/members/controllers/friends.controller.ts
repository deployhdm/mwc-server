import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Request } from "@nestjs/common";
import { MembersService } from "../services/members.service";
import { CreateInvitationDto } from "../../invitations/dto/create-invitation.dto";
import { InvitationsService } from "../../invitations/invitations.service";
import { FriendsService } from "../services/friends.service";
import { Invitation } from "src/modules/invitations/entities/invitation.entity";
import { UpdateInvitationDto } from "src/modules/invitations/dto/update-invitation.dto";

@Controller('friends')
export class FriendsController {
    constructor(
        private readonly membersService: MembersService,
        private readonly friendsService: FriendsService,
        // private readonly invitationsService: InvitationsService
    ) {}

}