import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LinkGroup } from "../entities/link-group.entity";
import { MembersService } from "src/modules/members/services/members.service";
import { In, Repository } from "typeorm";
import { CreateLinkGroupDto } from "../dto/linkGroup/create-link-group.dto";
import { UpdateLinkGroupDto } from "../dto/linkGroup/update-link-group.dto";

@Injectable()
export class LinkGroupsService {
    constructor(
        @InjectRepository(LinkGroup)
        private readonly linkGroupsRepository: Repository<LinkGroup>,
        private readonly membersService: MembersService
    ) {}

    async create(createLinkGroupDto: CreateLinkGroupDto): Promise<LinkGroup> {
        const { member, ...rest } = createLinkGroupDto
        const linkGroup = await this.linkGroupsRepository.create(rest) 
        if (member) {
            const memberInstance = await this.membersService.findOne(member)
            linkGroup.member = memberInstance
        }
        return await this.linkGroupsRepository.save(linkGroup)
    }

    async findAllByMemberId(id: number): Promise<LinkGroup[]> {
        return await this.linkGroupsRepository.find({ where: { member: { id: id } } })
    }

    async findOne(id: number): Promise<LinkGroup> {
        return await this.linkGroupsRepository.findOne({ 
            relations: ['links'],
            where: {id}
        })
    }

    async findSubsetIds(linkGroupIds: number[]): Promise<LinkGroup[]> {
        return await this.linkGroupsRepository.find({
            where: { id: In(linkGroupIds) }
        })
    }

    async findMemberIdByLinkGroupId(id: number): Promise<number>  {
        const linkGroup = await this.linkGroupsRepository.findOne({ where: {id} })
        if (!linkGroup) {
            throw new NotFoundException(`LinkGroup with ID ${id} not found`)
          }
        return linkGroup.member.id
    }

    async update(id: number, updateLinkGroupDto: UpdateLinkGroupDto): Promise<LinkGroup> {
        const linkGroup = await this.linkGroupsRepository.findOne({ where: {id} })
        if (!linkGroup){
            throw new NotFoundException(`LinkGroup with ID ${id} not found`)
        }
        Object.assign(linkGroup, updateLinkGroupDto)
        return await this.linkGroupsRepository.save(linkGroup)
    }

    async remove(id: number): Promise<LinkGroup> {
        const linkGroup = await this.linkGroupsRepository.findOne({ where: {id} })
        if (!linkGroup){
          throw new NotFoundException(`LinkGroup with ID ${id} not found`)
        }
        return await this.linkGroupsRepository.remove(linkGroup) 
    }

}