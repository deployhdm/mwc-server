import { IsNotEmpty, IsString } from "class-validator";

export class UpdateLinkGroupDto {
    @IsNotEmpty()
    @IsString()
    name: string
    
    description: string
}