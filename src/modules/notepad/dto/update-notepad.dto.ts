import { PartialType } from "@nestjs/mapped-types"
import { CreateNotepadDto } from "./create-notepad.dto"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateNotepadDto extends PartialType(CreateNotepadDto) {
    @IsNotEmpty()
    @IsString()
    content: string
}