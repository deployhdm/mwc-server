import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty()
    newPassword: string;

    @IsNotEmpty()
    memberId: number;
}