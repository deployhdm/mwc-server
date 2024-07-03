import { IsNotEmpty, IsNumber, IsString, IsUrl, isURL } from "class-validator"

export class CreateLinkDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    link: string

    @IsNumber()
    linksGroupId: number

    member?: number
}
