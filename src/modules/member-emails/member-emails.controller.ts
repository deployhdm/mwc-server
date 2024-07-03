import { Controller, Get, Post, Body, Param, Delete, Request, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { MemberEmailsService } from './member-emails.service';
import { CreateMemberEmailDto } from './dto/create-member-email.dto';
import { EmailService } from '../mailer/email.service';
import { MembersService } from '../members/services/members.service';

@Controller('member-emails')
export class MemberEmailsController {
  constructor(
    private readonly memberEmailsService: MemberEmailsService,
    private readonly emailService: EmailService,
    private readonly membersService: MembersService
  ) { }

  //add a new email with status created and send email for confirmation
  @Post()
  async create(@Request() request, @Body() createMemberEmailDto: CreateMemberEmailDto) {
    try {
      const userId = request.user.id;
      const member = await this.membersService.findOne(userId);
      if (!member) {
        throw new NotFoundException('Member not found');
      }
      const newEmail = await this.memberEmailsService.create(createMemberEmailDto, member.id);
      const encodNewEmailToken = encodeURIComponent(newEmail.token)
      await this.emailService.sendConfirmationAddEmail(newEmail, member.lastname, encodNewEmailToken);
      console.log(encodNewEmailToken);
      return true
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.memberEmailsService.findAll();
  }

  @Get(':token')
  async findOne(@Param('token') token: string) {
    const decodeToken = decodeURIComponent(token);
    return await this.memberEmailsService.findOne(decodeToken);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.memberEmailsService.remove(+id);
  }
}
