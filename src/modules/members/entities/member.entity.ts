import { Exclude, Transform } from 'class-transformer';
import { Invitation } from 'src/modules/invitations/entities/invitation.entity';
import { Meet } from 'src/modules/meets/entities/meet.entity';
import { MemberEmails } from 'src/modules/member-emails/entities/member-emails.entity';
import { Notepad } from 'src/modules/notepad/entities/notepad.entity';
import { Note } from 'src/modules/notes/entities/note.entity';
import { ResetToken } from 'src/modules/resetToken/entities/resetToken.entity';
import { Task } from 'src/modules/tasks/entities/task.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column({ nullable: true })
    hashPassword: string;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({ default: false })
    isRegistered: boolean;

    @Column({ nullable: true })
    firstname: string;

    @Column({ nullable: true })
    lastname: string;

    @OneToMany(() => Note, note => note.member)
    notes: Note[]

    @OneToMany(() => Task, task => task.member)
    tasks: Task[]

    @OneToMany(() => Meet, meet => meet.member)
    meets: Meet[]

    @Exclude()
    @ManyToMany(type => Member)
    @JoinTable()
    friends: Member[]

    @Transform(({ value }) => value.map(member => member.id))
    friendIds: number[]

    @OneToMany(() => Invitation, invitation => invitation.receiver)
    receivedInvitations: Invitation[]

    @OneToMany(() => Invitation, invitation => invitation.sender)
    sentInvitations: Invitation[]

    @OneToOne(() => Notepad, notepad => notepad.member)
    notepad: Notepad

    @CreateDateColumn()
    readonly created_at: Date

    @UpdateDateColumn()
    readonly updated_at: Date

    @Exclude()
    @Column({ default: '' })
    googleAccessToken: string

    @Exclude()
    @Column({ default: '' })
    googleRefreshToken: string

    @OneToMany(() => ResetToken, resetToken => resetToken.member)
    resetTokens: ResetToken[]

    @OneToMany(() => MemberEmails, memberEmails => memberEmails.member)
    memberEmails: MemberEmails[]

    @Column({ default: '' })
    googleEmail: string
}
