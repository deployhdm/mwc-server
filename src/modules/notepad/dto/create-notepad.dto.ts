import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Member } from "src/modules/members/entities/member.entity";

export class CreateNotepadDto {
    @IsNotEmpty()
    @IsInt()
    id: number

    @IsString()
    content: string
}