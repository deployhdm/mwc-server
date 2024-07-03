import { IsEnum, IsString } from "class-validator"
import { PermissionLevel } from "src/enums/permission.enum"

export class CreateLinkGroupMemberDto{
    @IsString()
    email: string 
    
    @IsEnum(PermissionLevel)
    permissionLevel: PermissionLevel
}