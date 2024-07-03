import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Logger, NotFoundException, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateMemberDto } from 'src/modules/members/dto/create-member.dto';
import { TokenGeneratorService } from './token-generator.service';
import { Public } from 'src/decorators/public.decorator';
import { NotepadService } from '../notepad/notepad.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { MembersService } from '../members/services/members.service';
import { EmailService } from '../mailer/email.service';
import { ResettokenService } from '../resetToken/resetToken.service';
import { ResetTokenDto } from '../resetToken/dto/resetToken.dto';
import { ResetPasswordDto } from '../resetToken/dto/resetPassword.dto';
import { CreateInvitedMemberDto } from '../members/dto/create-invited-member.dto';
import { NoteCollaborationsService } from '../note-collaborations/note-collaborations.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name)
  constructor(
    private readonly authService: AuthService,
    private readonly tokenGeneratorService: TokenGeneratorService,
    private readonly notepadService: NotepadService,
    private readonly memberService: MembersService,
    private readonly emailService: EmailService,
    private readonly resetTokenService: ResettokenService,
    private readonly noteCollaborationsService: NoteCollaborationsService,
    private readonly configService: ConfigService,
  ) { }

  @Public()
  @Post('register')
  async register(@Body() createMemberDto: CreateMemberDto) {
    const member = await this.authService.register(createMemberDto)
    this.logger.debug('Creating notepad')
    const notepad = await this.notepadService.create(member)
    this.logger.debug(notepad?.id)
    return member
  }

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    return await this.authService.signIn(signInDto.email, signInDto.password)
  }

  @Public()
  @Post('jwt')
  async generateToken(@Body() credentials: { email: string, password: string }): Promise<string> {
    const { email, password } = credentials;
    const token = await this.tokenGeneratorService.generateToken(email, password)
    return token
  }

  @Public()
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() { }

  @Public()
  @Get('google/callback')
  // @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req, @Res() res) {
    if (req.user) {
      // La synchronisation a abouti
      this.logger.debug('Google Auth réussie')
      const redirectUrl = this.configService.get<string>('REDIRECT_URL')
      res.redirect(redirectUrl)
    } else {
      this.logger.debug('Google Auth ratée')
      const redirectUrl = this.configService.get<string>('REDIRECT_URL') + '/#/?error=google_sync_error'
      this.logger.debug(redirectUrl)
      res.redirect(redirectUrl)
    }
  }

  @Public()
  @Get('status')
  user(@Req() req) {
    if (req.user) {
      return { message: 'Authenticated', user: req.user }
    } else {
      return { message: 'Not Authenticated' }
    }
  }

  //generate and send reset password email with token
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      if (!email) {
          throw new BadRequestException('Email address is required.');
      }

      const member = await this.memberService.findByEmail(email);
      if (member === null) {
          throw new NotFoundException('Email not found');
      }

      const resetToken = await this.authService.generateToken(member);
      const encodResetToken = encodeURIComponent(resetToken.token);
      await this.emailService.sendResetPwdEmail(member, encodResetToken);
      
      return { message: 'Reset password email sent successfully.' };
  } catch (error) {
         throw new InternalServerErrorException('Error occurred. '+ error.message);
  }
}

//verify token before showing form
  @Public()
  @Get('reset-password/:token')
  async getResetToken(@Param('token') token: string): Promise<ResetTokenDto> {
    const resetToken = await this.resetTokenService.findResetTokenByToken(token);
    if (!resetToken || resetToken.validityEndDate < new Date())
      throw new NotFoundException("No valid token found");
    const resetTokenDto: ResetTokenDto = {
      token: resetToken.token,
      memberId: resetToken.member.id
    }
    return resetTokenDto;
  }


  //reset password
  @Public()
  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const { newPassword, memberId } = resetPasswordDto;
      const decodeToken = decodeURIComponent(token);
      const resetToken = await this.resetTokenService.findResetTokenByToken(decodeToken);
      if (!resetToken || resetToken.member.id !== memberId) {
        throw new BadRequestException('Invalid reset token.');
      }
      await this.memberService.resetPassword(memberId, newPassword);
      await this.resetTokenService.deleteAllResetTokensByMemberId(memberId);
      return { message: 'Password successfully updated' };

    } catch (error) {
      throw new InternalServerErrorException('Error Occured, password could not be updated. '+error.message);
    }
  }

  //verify token before showing register form
  @Public()
  @Get('invite-register/:token')
  async verifyMemberEmail(@Param('token') token: string){
    const decodeToken = decodeURIComponent(token)
    const noteCollab = await this.noteCollaborationsService.getMemberIdByInvitationToken(decodeToken);
    if (!noteCollab) {
      throw new NotFoundException('No valid token found')
    }
    const member = await this.memberService.findOne(noteCollab.member.id);
    if (!member) {
      throw new NotFoundException('No valid temporary member found');
    }
    return member;
  }

  //verify token and update user
  @Public()
  @Post('invite-register/:token')
  async createInvitedMember(@Param('token') token: string, @Body() createInvitedMemberDto: CreateInvitedMemberDto) {
    const decodeToken = decodeURIComponent(token);
    try{
      const noteCollab = await this.noteCollaborationsService.getMemberIdByInvitationToken(decodeToken);
      if (!noteCollab) {
        throw new NotFoundException('No valid token found')
      }
      const member = await this.memberService.findOne(noteCollab.member.id);
      if (!member) {
        throw new NotFoundException('No valid temporary member found');
      }
      // regiter the invited member
      const memberRegistred = await this.memberService.createInvitedMember(noteCollab.member.id, createInvitedMemberDto)
      // create de notepad for the new member
      await this.notepadService.create(member)
      // update the status of column isUserRegistred in note collaborations table
      await this.noteCollaborationsService.updatenoteCollabRegisterStatus(noteCollab.id)
      return memberRegistred
    } catch(error){
      throw new InternalServerErrorException ('Internal error : '+error.message)
    }
    
  }
}
