import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'First name must not be empty' })
    @MinLength(2, { message: 'First name must be at least 2 characters long' })
    @MaxLength(50, { message: 'First name cannot be longer than 50 characters' })
    firstname?: string 

    @IsOptional()
    @IsString()
    lastname?: string 

    @IsOptional()
    @IsString()
    oldPassword?: string 

    @IsOptional()
    @IsString()
    // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character' })
    newPassword?: string 

    @IsOptional()
    @IsEmail()
    newEmail?: string
}
