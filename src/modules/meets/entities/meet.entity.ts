import { Exclude, Expose } from "class-transformer";
import { Member } from "src/modules/members/entities/member.entity";
import { Recurrence } from "src/modules/tasks/entities/task.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Meet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ type: "text" })
    description: string;

    @Column({ nullable: false })
    dateBegin: Date;

    @Column({ nullable: false })
    dateEnding: Date;

    @Column({ default: false })
    isRecurring: boolean;

    @Column({ 
        type: "enum",
        enum: Recurrence,
        default: Recurrence.NONE,
    })
    recurrence: Recurrence;

    @Column()
    linkOrLocalisation: string;

    @ManyToOne(() => Member)
    member: Member;

    
    @ManyToMany(() => Member, { eager: true})
    @JoinTable()
    @Exclude()
    sharedWith: Member[];

    @Expose()
    get MemberId(): number[] {
        return this.sharedWith.map(member => member.id)
    }

    @CreateDateColumn()
    readonly created_at: Date 
  
    @UpdateDateColumn()
    readonly updated_at: Date
}
