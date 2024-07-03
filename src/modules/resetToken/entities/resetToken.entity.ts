import { Member } from "src/modules/members/entities/member.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ResetToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @ManyToOne(() => Member, member => member.resetTokens)
    member: Member;

    @Column()
    validityEndDate: Date;
}

