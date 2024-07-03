import { IsEmail, IsInt, IsNotEmpty, IsOptional, Length } from "class-validator";
import { Member } from "src/modules/members/entities/member.entity";

export class CreateInvitationDto {
    @IsNotEmpty()
    @IsEmail()
    @Length(4, 200)
    email: string
    // receiverInvitationEmail: string

    @IsOptional()
    @IsInt()
    senderId?: number

    // Not used in validation as their values are assignin after querying the db
    receiver?: Member
    sender?: Member
}
