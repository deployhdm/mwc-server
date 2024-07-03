import { Module } from '@nestjs/common';
import { ResettokenService } from './resetToken.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetToken } from './entities/resetToken.entity';
import { EmailService } from '../mailer/email.service';
import { PostmarkService } from '../mailer/postmark.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResetToken]),
  ],
  providers: [
    ResettokenService,
    EmailService,
    PostmarkService,
  ],
  exports: [TypeOrmModule, ResettokenService]
})
export class ResettokenModule { }
