import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator"

export class CreateNoteDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 255)
    title: string

    @IsString()
    content: string

    @IsOptional()
    @IsInt()
    member?: number

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    sharedWith?: number[]
}
