import { IsEmail, IsNotEmpty } from "class-validator";
export class CreateMemberEmailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
