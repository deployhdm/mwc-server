import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { Invitation } from './entities/invitation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from '../members/services/members.service';
import { MembersModule } from '../members/members.module';
import { InvitationsController } from './invitations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation]), MembersModule],
  providers: [InvitationsService, MembersService],
  controllers: [InvitationsController],
  exports: [TypeOrmModule, InvitationsService]
})
export class InvitationsModule {}
