import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpStatus, Put, UseGuards, SetMetadata } from '@nestjs/common';
import { LinksService } from '../services/links.service';
import { CreateLinkDto } from '../dto/link/create-link.dto';
import { UpdateLinkDto } from '../dto/link/update-link.dto';
import { LinkGuard } from 'src/guards/link/link.guard';
import { PermissionLevel } from 'src/enums/permission.enum';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @UseGuards(LinkGuard)
  @SetMetadata(PermissionLevel, PermissionLevel.WRITE)
  @Post()
  async create(@Request() req, @Body() createLinkDto: CreateLinkDto) {
    const userId = req.user.id
    if (!userId){
      throw new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
    }
    createLinkDto.member = userId
    return await this.linksService.create(createLinkDto);
  }

  @Get()
  async findAllLinks(@Request() req) {
    const userId = req.user.id
    const links = await this.linksService.findAllLinksInLinkGroupCreatedByMemberId(userId)
    const sharedLinks = await this.linksService.findAllSharedLinks(userId)
    const allLinks = [...links, ...sharedLinks]
    return { 
      results: {
        links: allLinks 
      },
      count: allLinks.length
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.linksService.findOne(+id)
  }

  @UseGuards(LinkGuard)
  @SetMetadata(PermissionLevel, PermissionLevel.WRITE)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return await this.linksService.update(+id, updateLinkDto);
  }

  @UseGuards(LinkGuard)
  @SetMetadata(PermissionLevel, PermissionLevel.READ)
  @Post(':id')
  async clickOnLink(@Param('id') id: string, @Request() req) {
    const link = await this.linksService.clickOnLink(+id)
    return { 
      results: {
        links: [link] 
      },
      count: 1
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.linksService.remove(+id);
  }
}
