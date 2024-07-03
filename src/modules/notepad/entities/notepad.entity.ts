import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Member } from "../../members/entities/member.entity";
import { Expose } from "class-transformer";

@Entity()
export class Notepad {
    @PrimaryColumn()
    id: number;

    @Column({ type: "text", nullable: true })
    content: string;

    @OneToOne(() => Member)
    @JoinColumn()
    member: Member

    // @Expose()
    // get id(): number {
    //     return this.member.id
    // }
}