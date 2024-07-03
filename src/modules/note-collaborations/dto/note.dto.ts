import { PermissionLevel } from "src/enums/permission.enum"

export class NoteDto {
    id: number
    title: string 
    content: string 
    collaboratorCount: number
    permissionLevel: string
    created_at: Date 
    updated_at: Date
}