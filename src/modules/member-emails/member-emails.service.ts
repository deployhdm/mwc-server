import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMemberEmailDto } from './dto/create-member-email.dto';
import { UpdateMemberEmailDto } from './dto/update-member-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEmails } from './entities/member-emails.entity';
import { FindOptionsWhere, LessThan, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MemberEmailsService {
  private readonly logger = new Logger(MemberEmailsService.name);
  constructor(
    @InjectRepository(MemberEmails)
    private readonly memberMailsRepository: Repository<MemberEmails>,
  ) { }

  async create(createMemberEmailDto: CreateMemberEmailDto, memberId):Promise<MemberEmails> {
    const {email} = createMemberEmailDto;
    const where: FindOptionsWhere<MemberEmails> = { email};
    const existingEmail = await this.memberMailsRepository.findOne({where});
    if (existingEmail){
      throw new ConflictException('Email already exist')
    }
    const token = Math.random().toString(36).substring(7);
    const hashedToken = await bcrypt.hash(token, 10);
    
    const newEmail = this.memberMailsRepository.create({
      member: { id: memberId },
      email: email,
      status: 'created',
      token: hashedToken
    });
    console.log(newEmail)
    
    const savedEmail = this.memberMailsRepository.save(newEmail);
    return savedEmail;
  }
    
    

  findAll() {
    return `This action returns all memberEmails`;
  }

  // find the email and set status to confirmed in DB
  async findOne(token: string):Promise<MemberEmails> {
    const where: FindOptionsWhere<MemberEmails> = {token};
    const emailByToken = await this.memberMailsRepository.findOne({where});
    if (!emailByToken){
      throw new NotFoundException('Token not found')
    }
    if (emailByToken.status === 'confirmed'){
      throw new ConflictException('Email already confirmed')
    }
    emailByToken.status = 'confirmed'
    await this.memberMailsRepository.save(emailByToken)

    return emailByToken
  }

  // update(id: number, updateMemberEmailDto: UpdateMemberEmailDto) {
  //   return `This action updates a #${id} memberEmail`;
  // }

  //delete the email from member-emails table
  async remove(id: number) {
    const where: FindOptionsWhere<MemberEmails> = {id};
    const email = await this.memberMailsRepository.findOne({where});
    if (!email){
      throw new NotFoundException('Email not found')
    }
    return await this.memberMailsRepository.delete(where);
  }

  // delete the email/token after 7 days if not confirmed
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  // @Cron(CronExpression.EVERY_MINUTE)
  async cleanupUnconfirmedEmails(): Promise<void> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    // sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 1);
    const unconfirmedEmails = await this.memberMailsRepository.find({
      where: {
        status: 'created',
        createdAt: LessThan(sevenDaysAgo), 
      },
    });
    await this.memberMailsRepository.remove(unconfirmedEmails);

    this.logger.log(`Unconfirmed emails cleanup executed at: ${new Date()}`);
  }


}
