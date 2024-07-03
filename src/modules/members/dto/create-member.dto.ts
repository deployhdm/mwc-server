import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";

export class CreateMemberDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    password: string;

    @IsBoolean()
    isAdmin: boolean = false;
}
