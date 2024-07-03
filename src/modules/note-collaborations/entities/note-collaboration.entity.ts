import { Exclude, Expose } from "class-transformer";
import { PermissionLevel } from "src/enums/permission.enum";
import { Member } from "src/modules/members/entities/member.entity";
import { Note } from "src/modules/notes/entities/note.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['member', 'note'])
export class NoteCollaboration {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Member)
    member: Member

    @ManyToOne(() => Note, { onDelete: 'CASCADE', eager: true })
    @Exclude()
    note: Note

    @Column({ type: 'enum', enum: PermissionLevel })
    permissionLevelNumeric: PermissionLevel

    @Column({ default: false })
    isUserRegistered: boolean

    @Column()
    invitationToken: string

    @Expose()
    get email(): string {
        return this.member.email
    }

    @Expose()
    get permissionLevel(): string {
        return PermissionLevel[this.permissionLevelNumeric]
    }
    
}
