import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LinkGroupMember } from "../entities/link-group-member.entity";
import { Repository } from "typeorm";
import { MembersService } from "src/modules/members/services/members.service";
import { LinkGroupsService } from "./link-groups.service";
import { CreateLinkGroupMemberDto } from "../dto/linkGroupMember/create-link-group-member.dto";
import { PermissionLevel } from "src/enums/permission.enum";
import { LinkGroupDto } from "../dto/linkGroup/link-group.dto";
import { LinkGroup } from "../entities/link-group.entity";

@Injectable()
export class LinkGroupMemberService {
    constructor(
        @InjectRepository(LinkGroupMember)
        private readonly linkGroupMemberRepository: Repository<LinkGroupMember>,
        private readonly membersService: MembersService,
        private readonly linkGroupsService: LinkGroupsService,
    ){}

    async create(id: number, createLinkGroupMemberDto: CreateLinkGroupMemberDto): Promise<LinkGroupMember> {
      const linkGroup = await this.linkGroupsService.findOne(id)
      if (!linkGroup) {
        throw new NotFoundException(`LinkGroup with ID ${id} not found`)
      }
      const { email, permissionLevel } = createLinkGroupMemberDto
      let member = await this.membersService.findByEmail(email)
      // If email is not in database;
      if (!member) {
        // Create a temporary member in database
        member = await this.membersService.createTemporaryUser(email)
      }

      // Check if the LinkGroupMember already exists
      const existingLinkGroupMember = await this.linkGroupMemberRepository.findOne({
          where: { member: { id: member.id }, linkGroup: { id: linkGroup.id } },
      });
  
      if (existingLinkGroupMember) {
          throw new ConflictException(`This link group is already shared with user.`);
      }

      // Create LinkGroupMember
      const linkGroupMember = new LinkGroupMember()
      linkGroupMember.member = member
      linkGroupMember.linkGroup = linkGroup
      linkGroupMember.permissionLevelNumeric = PermissionLevel[permissionLevel.toString()]
      linkGroupMember.invitationToken = ''
      linkGroupMember.isUserRegistered = member.isRegistered
      return this.linkGroupMemberRepository.save(linkGroupMember)
    }

    async findAllLinkGroupMemberByLinkGroupId(id: number): Promise<LinkGroupMember[]> {
        return await this.linkGroupMemberRepository.find({
            relations: ['linkGroup', 'member'],
            where: { linkGroup: {id: id} }
        })
    }

    async findAllLinkGroupMemberByMemberId(id: number): Promise<LinkGroupMember[]> {
      return await await this.linkGroupMemberRepository.find({
        relations: ['linkGroup', 'member'],
        where: { member: {id:id} }
      })
    }

    async findAllSharedLinkGroupsByMemberId(id: number): Promise<LinkGroup[]> {
      const sharedLinkGroupMembers = await this.findAllLinkGroupMemberByMemberId(id)
      const sharedLinkGroupsIds = sharedLinkGroupMembers.map(lg => lg.linkGroup.id)
      const sharedLinkGroups = await this.linkGroupsService.findSubsetIds(sharedLinkGroupsIds)

      return sharedLinkGroups
    }

    async getAllSharedLinkGroupsDtoByMemberId(id: number): Promise<LinkGroupDto[]> {
      const sharedLinkGroupMembers = await this.findAllLinkGroupMemberByMemberId(id)
      const sharedLinkGroupWithPermission : { linkGroup: LinkGroup, permissionLevel: string }[] = sharedLinkGroupMembers.map(lgm => ({
        linkGroup: lgm.linkGroup,
        permissionLevel: PermissionLevel[lgm.permissionLevelNumeric]
      }))

      const sharedLinkGroups = await this.findAllSharedLinkGroupsByMemberId(id)
      const sharedLinkGroupsWithPermissionLevel: LinkGroupDto[] = sharedLinkGroups.map(lg => {
        const { member, ...rest } = lg
        const ownerEmail = member.email
        const entry = sharedLinkGroupWithPermission.find(entry => entry.linkGroup.id == lg.id)
        if (entry) {
          return { ...rest, member: ownerEmail, permissionLevel: entry.permissionLevel}
        }
      })
      
      return sharedLinkGroupsWithPermissionLevel

    }

    async getPermissionLevelByLinkGroupIdAndMemberId(linkGroupId: number, userId: number): Promise<PermissionLevel> {
      const noteCollaboration = await this.linkGroupMemberRepository.findOne({
        relations: ['linkGroup', 'member'],
        where: {
          linkGroup: {id: linkGroupId},
          member: {id: userId}
        }
      })
      if (!noteCollaboration) {
        throw new ForbiddenException(`You cannot access this ressource` )
      }
      return noteCollaboration.permissionLevelNumeric
    }
    

    async removeByEmailAndLinkGroupId(id: number, email: string): Promise<boolean> {
      try {
          const linkGroupMember = await this.linkGroupMemberRepository.findOne({
              relations: ['member', 'linkGroup'],
              where: {
                member: { email: email },
                linkGroup: { id: id}
              }
          })
          if (!linkGroupMember) {
              throw new NotFoundException(`This GroupLink is not shared with ${email}`)
          }
          await this.linkGroupMemberRepository.remove(linkGroupMember)
          return true
      } catch (error) {
          throw error
      }
  }
}