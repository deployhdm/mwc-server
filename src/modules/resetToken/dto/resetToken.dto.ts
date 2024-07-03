import { IsNotEmpty } from 'class-validator';

export class ResetTokenDto {
    @IsNotEmpty()
    token: string

    @IsNotEmpty()
    memberId: number
}