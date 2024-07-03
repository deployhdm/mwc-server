import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Request, SetMetadata, UseGuards } from "@nestjs/common";
import { LinkGroupsService } from "../services/link-groups.service";
import { CreateLinkGroupDto } from "../dto/linkGroup/create-link-group.dto";
import { UpdateLinkGroupDto } from "../dto/linkGroup/update-link-group.dto";
import { LinkGroupMemberService } from "../services/link-group-member.service";
import { PermissionLevel } from "src/enums/permission.enum";
import { CreateLinkGroupMemberDto } from "../dto/linkGroupMember/create-link-group-member.dto";
import { LinkGroupGuard } from "src/guards/link-group/link-group.guard";

@UseGuards(LinkGroupGuard)
@Controller('linksgroup')
export class LinkGroupsController {
    constructor(
        private readonly linkGroupsService: LinkGroupsService,
        private readonly linkGroupMemberService: LinkGroupMemberService,
    ) {}

    @Get('shared') 
    async getSharedLinkGroups(@Request() req) {
        const userId = req.user.id
        console.error(userId)
        const sharedLinkGroups = await this.linkGroupMemberService.findAllSharedLinkGroupsByMemberId(userId)
        return sharedLinkGroups
    }

    @Post()
    async create(@Request() req, @Body() createLinkGroupDto: CreateLinkGroupDto) {
        const userId = req.user.id
        if (!userId){
          throw new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
        }
        createLinkGroupDto.member = userId
        return await this.linkGroupsService.create(createLinkGroupDto);
    }

    @Get()
    async findAllByMemberId(@Request() req) {
        const userId = req.user.id
        const linkGroups = await this.linkGroupsService.findAllByMemberId(userId)
        const sharedLinkGroups = await this.linkGroupMemberService.getAllSharedLinkGroupsDtoByMemberId(userId)
        const allLinkGroups = [...linkGroups, ...sharedLinkGroups]
        return { results: { linksGroup: allLinkGroups }}
    }

    @Post(':id/share')
    @SetMetadata(PermissionLevel, PermissionLevel.WRITE_AND_SHARE)
    async shareLinkGroupWithMember(@Param('id') id: string, @Body() linkGroupMember: CreateLinkGroupMemberDto) {
      const lgm = await this.linkGroupMemberService.create(+id, linkGroupMember)
      return lgm
    }

    @Get(':id/share')
    @SetMetadata(PermissionLevel, PermissionLevel.WRITE_AND_SHARE)
    async getMembersSharedLinkGroup(@Param('id') id: string) {
        const linkGroupMembers = await this.linkGroupMemberService.findAllLinkGroupMemberByLinkGroupId(+id)
        return { collaborators: linkGroupMembers}
    }

    @Delete(':id/share')
    async cancelShareInvitLinkGroup(@Param('id') id: string, @Query('email') email: string) {
        return await this.linkGroupMemberService.removeByEmailAndLinkGroupId(+id, email)
    }

    @Get(':id')
    @SetMetadata(PermissionLevel, PermissionLevel.READ)
    async findOne(@Param('id') id: string) {
        return await this.linkGroupsService.findOne(+id)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateLinkGroupDto: UpdateLinkGroupDto) {
        return await this.linkGroupsService.update(+id, updateLinkGroupDto)
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.linkGroupsService.remove(+id);
    }

}