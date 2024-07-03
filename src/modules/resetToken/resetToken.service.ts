import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ResetToken } from './entities/resetToken.entity';
import { addHours } from 'date-fns';

@Injectable()
export class ResettokenService {
  constructor(
    @InjectRepository(ResetToken)
    private resetTokenRepository: Repository<ResetToken>,
  ) { }

  //save the hashed token into the DB and add a validitytime
  async createToken(memberId: number, token: string): Promise<ResetToken> {
    const validityHours = 24;
    const validityEndDate = addHours(new Date(), validityHours);

    const newToken = this.resetTokenRepository.create({ member: { id: memberId }, token, validityEndDate: validityEndDate });
    return this.resetTokenRepository.save(newToken);
  }

  async findResetTokenByToken(token: string): Promise<ResetToken> {
    const resetToken = await this.resetTokenRepository.findOne({ where: { token: token }, relations: ['member'] });
    return resetToken
  }

  async deleteAllResetTokensByMemberId(memberId: number): Promise<void> {
    const where: FindOptionsWhere<ResetToken> = { member: { id: memberId }};
    await this.resetTokenRepository.delete(where);
  }

}
