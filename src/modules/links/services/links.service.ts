import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateLinkDto } from '../dto/link/create-link.dto';
import { UpdateLinkDto } from '../dto/link/update-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from '../entities/link.entity';
import { In, Repository } from 'typeorm';
import { MembersService } from 'src/modules/members/services/members.service';
import { LinkGroupsService } from './link-groups.service';
import { LinkGroupMemberService } from './link-group-member.service';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
    private readonly linkGroupsService: LinkGroupsService,
    private readonly membersService: MembersService,
    private readonly linkGroupMemberService: LinkGroupMemberService,
  ) {}

  async create(createLinkDto: CreateLinkDto): Promise<Link> {
    const { member, linksGroupId, ...rest } = createLinkDto
    const link = await this.linksRepository.create(rest)
    if (member) {
      const memberInstance = await this.membersService.findOne(member)
      link.member = memberInstance
    }
    if (linksGroupId) {
      const linksGoup = await this.linkGroupsService.findOne(linksGroupId)
      link.linkGroup =  linksGoup
    }
    return await this.linksRepository.save(link)
  }

  async findAllByMemberId(id: number): Promise<Link[]> {
    return await this.linksRepository.find({ where: { member: { id: id } } })
  }

  async findAllByLinkGroupIdSubset(ids: number[]): Promise<Link[]> {
    return await this.linksRepository.find({ where: { linkGroup: { id: In(ids) } } })
  }

  async findOne(id: number) {
    const link = await this.linksRepository.findOne({ where: {id}})
    if (!link) {
      throw new NotFoundException(`Link with ID ${id} not found`)
    }
    return link
  }

  async update(id: number, updateLinkDto: UpdateLinkDto): Promise<Link> {
    const link = await this.linksRepository.findOne({ where: {id} })
    if(!link){
      throw new NotFoundException(`Link with ID ${id} not found`)
    }
    Object.assign(link, updateLinkDto)
    return await this.linksRepository.save(link)
  }

  async remove(id: number): Promise<Link> {
    const link = await this.linksRepository.findOne({ where: {id} })
    if (!link){
      throw new NotFoundException(`Link with ID ${id} not found`)
    }
    return await this.linksRepository.remove(link)
  }

  async clickOnLink(id: number): Promise<Link> {
    const link = await this.linksRepository.findOne({ where: {id} })
    if (!link){
      throw new NotFoundException(`Link with ID ${id} not found`)
    }

    link.clickedCounter += 1
    return await this.linksRepository.save(link)
  }

  async findAllSharedLinks(id: number): Promise<Link[]> {
    const sharedLinkGroups = await this.linkGroupMemberService.findAllSharedLinkGroupsByMemberId(id)
    const sharedLinkGroupsIds = sharedLinkGroups.map(lg => lg.id)
    return await this.findAllByLinkGroupIdSubset(sharedLinkGroupsIds)
  }

  async findAllLinksInLinkGroupCreatedByMemberId(id: number): Promise<Link[]> {
    const linkGroupsCreatedByMemberId = await this.linkGroupsService.findAllByMemberId(id)
    const linkGroupsIds = linkGroupsCreatedByMemberId.map(lg => lg.id)
    return await this.findAllByLinkGroupIdSubset(linkGroupsIds)
  }
}
