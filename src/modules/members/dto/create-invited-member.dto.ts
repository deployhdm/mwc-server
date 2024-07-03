import {IsNotEmpty } from "class-validator";

export class CreateInvitedMemberDto {
    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    password: string;
}
