import { Member } from "src/modules/members/entities/member.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LinkGroup } from "./link-group.entity";
import { Exclude, Expose } from "class-transformer";

@Entity()
export class Link {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    name: string 

    @Column({ nullable: false, length: 400})
    link: string

    @Column({ length: 400, default: '' })
    description: string

    @Column({ default: 0})
    clickedCounter: number

    @ManyToOne(() => LinkGroup, { eager: true })
    linkGroup: LinkGroup

    @ManyToOne(() => Member, { eager: true })
    @Exclude()
    member: Member

    @Expose()
    get MemberId(): number {
        return this.member.id
    }

    @Expose()
    get linksGroupId(): number {
        return this.linkGroup.id
    }
}
