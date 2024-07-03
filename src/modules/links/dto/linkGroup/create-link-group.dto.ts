import { IsNotEmpty, IsString } from "class-validator"

export class CreateLinkGroupDto {
    @IsNotEmpty()
    @IsString()
    name: string

    description: string

    member?: number
}