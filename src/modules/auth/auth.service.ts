import { Injectable, NotFoundException } from '@nestjs/common';
import { MembersService } from 'src/modules/members/services/members.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateMemberDto } from 'src/modules/members/dto/create-member.dto';
import { Member } from '../members/entities/member.entity';
import { ResettokenService } from '../resetToken/resetToken.service';
import { ResetToken } from '../resetToken/entities/resetToken.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly membersService: MembersService,
        private readonly jwtService: JwtService,
        private readonly resetTokenService: ResettokenService,
        private readonly configService: ConfigService,
    ) { }

    async register(createMemberDto: CreateMemberDto) {
        return await this.membersService.create(createMemberDto)
    }

    async signIn(email: string, password: string): Promise<any> {
        const member = await this.membersService.findByEmail(email);
        if (!member) {
            throw new NotFoundException('Bad Credential');
        }

        if (!(await bcrypt.compare(password, member.hashPassword))) {
            throw new NotFoundException('Bad Credential');
        }

        const token = await this.createToken(member)

        return {
            id: member.id,
            token: token
        }
    }

    async createToken(member: Member) {
        return this.jwtService.sign(
            {
                id: member.id,
                email: member.email,
            },
            { secret: this.configService.get('JWT_SECRET')}
        )
    }

    validateToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token, { secret: this.configService.get('JWT_SECRET')})
        } catch (error) {
            return null
        }
    }

    async validateUser(email: string): Promise<Member> {
        const user = await this.membersService.findByEmail(email)
        if (user) {
            return user
        }
    }

    async findUser(id: number): Promise<Member> {
        return await this.membersService.findOne(id)
    }

    //generate and hash the token 
    async generateToken(member: Member): Promise<ResetToken> {
        const token = Math.random().toString(36).substring(7);
        const hashedToken = await bcrypt.hash(token, 10);
        const generatedToken = await this.resetTokenService.createToken(member.id, hashedToken);
        console.log(generatedToken);
        return generatedToken
    }

}
