import { Exclude, Expose } from "class-transformer";
import { PermissionLevel } from "src/enums/permission.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { LinkGroup } from "./link-group.entity";
import { Member } from "src/modules/members/entities/member.entity";

@Entity()
@Unique(['member', 'linkGroup'])
export class LinkGroupMember {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Member, { eager: true })
    @Exclude()
    member: Member

    @ManyToOne(() => LinkGroup, { onDelete: 'CASCADE', eager: true })
    linkGroup: LinkGroup

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
