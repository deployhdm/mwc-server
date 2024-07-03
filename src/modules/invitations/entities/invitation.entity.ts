import { Exclude, Expose, Transform } from "class-transformer";
import { Member } from "src/modules/members/entities/member.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['sender', 'receiver'])
export class Invitation {
    @PrimaryGeneratedColumn()
    idPrimary: number

    @Exclude()
    @ManyToOne(() => Member, { eager: true })
    receiver : Member

    @Exclude()
    @ManyToOne(() => Member, { eager: true })
    sender : Member

    @Expose()
    get reiceverInvitationEmail(): string {
        return this.receiver.email
    }

    @Expose()
    get senderInvitationId(): number {
        return this.sender.id
    }

    @Expose()
    get id(): number {
        return this.receiver.id
    }

}
