import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Link } from "./link.entity";
import { Member } from "src/modules/members/entities/member.entity";
import { Transform } from "class-transformer";

@Entity()
export class LinkGroup {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, length: 50 })
    name: string 

    @Column({ length: 400})
    description: string

    @OneToMany(() => Link, link => link.linkGroup)
    links: Link[]

    @ManyToOne(() => Member, { eager: true })
    @Transform(({ value }) => value.email)
    member: Member

}