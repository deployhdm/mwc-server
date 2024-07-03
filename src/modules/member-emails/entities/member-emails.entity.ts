import { Member } from "src/modules/members/entities/member.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MemberEmails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    status: string;

    @Column()
    token: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Member, member => member.memberEmails) // Définit la relation Many-to-One vers Member
    member: Member; // Déclare la propriété member dans MemberMails
}
