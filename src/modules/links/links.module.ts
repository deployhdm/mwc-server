import { Module } from '@nestjs/common';
import { LinksService } from './services/links.service';
import { LinksController } from './controllers/links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { LinkGroup } from './entities/link-group.entity';
import { MembersModule } from '../members/members.module';
import { MembersService } from '../members/services/members.service';
import { LinkGroupsService } from './services/link-groups.service';
import { LinkGroupsController } from './controllers/link-groups.controller';
import { LinkGroupMember } from './entities/link-group-member.entity';
import { LinkGroupMemberService } from './services/link-group-member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Link, LinkGroup, LinkGroupMember]), MembersModule],
  controllers: [LinksController, LinkGroupsController],
  providers: [LinksService, LinkGroupsService, MembersService, LinkGroupMemberService],
})
export class LinksModule {}
