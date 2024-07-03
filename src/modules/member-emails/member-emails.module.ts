import { Module } from '@nestjs/common';
import { MemberEmailsService } from './member-emails.service';
import { MemberEmailsController } from './member-emails.controller';
import { MemberEmails } from './entities/member-emails.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from '../mailer/email.service';
import { MembersService } from '../members/services/members.service';
import { Member } from '../members/entities/member.entity';
import { PostmarkService } from '../mailer/postmark.service';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEmails]), TypeOrmModule.forFeature([Member])],
  controllers: [MemberEmailsController],
  providers: [MemberEmailsService, EmailService, MembersService, PostmarkService],
})
export class MemberEmailsModule { }
