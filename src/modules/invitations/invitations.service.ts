import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from './entities/invitation.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { MembersService } from '../members/services/members.service';

@Injectable()
export class InvitationsService {
  private logger = new Logger()
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationsRepository: Repository<Invitation>,
    private readonly membersService: MembersService
  ){}


  async create(createInvitationDto: CreateInvitationDto): Promise<Invitation> {
    try {
      const invitation = new Invitation()
      invitation.receiver = createInvitationDto.receiver
      invitation.sender = createInvitationDto.sender
      return await this.invitationsRepository.save(invitation)      
    } catch (error) {
      if (error instanceof QueryFailedError){
        throw new ConflictException('Invitation already exists')
      } else {
        throw error
      }
    }
  }

  findAll() {
    return `This action returns all invitations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} invitation`;
  }

  async findByReceiverAndSender(updateInvitationDto: UpdateInvitationDto): Promise<Invitation> {
    return await this.invitationsRepository.findOne({
      where: {
        receiver: { id: updateInvitationDto.receiverId },
        sender: { id: updateInvitationDto.senderId }
      }
    })
  }

  update(id: number, updateInvitationDto: UpdateInvitationDto) {
    return `This action updates a #${id} invitation`;
  }

  async remove(invitation: Invitation): Promise<Invitation> {
    // const invitation =  await this.invitationsRepository.findOne({ where: {id}})
    // if (!invitation){
    //   throw new NotFoundException('Invitation not found')
    // }
    return await this.invitationsRepository.remove(invitation)
  }

  async sendInvitation(createInvitationDto: CreateInvitationDto): Promise<Invitation>{
    const receiver = await this.membersService.findByEmail(createInvitationDto.email)
    this.logger.debug(receiver)

    if (!receiver) {
        this.logger.debug('Throwing error because receiver is ', receiver)
        throw new NotFoundException(`Invitation receiver with email ${ createInvitationDto.email } not found`)
    }

    const sender = await this.membersService.findOneWithFriends(createInvitationDto.senderId)
    if (!sender) {
        throw new NotFoundException(`Sender with ID ${createInvitationDto.senderId} not found`)
    }
    const isReceiverFriendWithSender = sender.friends.some(friend => friend.id === receiver.id)
    if (isReceiverFriendWithSender){
      throw new ConflictException('Receiver is friends with sender')
    }

    createInvitationDto.sender = sender
    createInvitationDto.receiver = receiver
    return await this.create(createInvitationDto)
  }

  async acceptInvitation(updateInvitationDto: UpdateInvitationDto): Promise<Invitation> {
    try {
      this.logger.debug('Entering acceptInvitation (invitation.service)')
      const invitation = await this.findByReceiverAndSender(updateInvitationDto)
      if (!invitation) {
          throw new NotFoundException('Invitation does not exist')
      }

      const isFriendshipAdded = await this.membersService.addFriendship(updateInvitationDto)
      if (isFriendshipAdded) {
        this.logger.debug('After adding friendship, returning invitation', invitation)
        const removedInvitation = Object.assign({}, invitation)
        await this.invitationsRepository.remove(invitation)
        this.logger.debug('removedInvitation', removedInvitation)
        return removedInvitation
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Deletes invitation received by user
   * @param updateInvitationDto 
   * @returns 
   */
  async refuseInvitation(updateInvitationDto: UpdateInvitationDto): Promise<Invitation> {
    try {
      const invitation = await this.findByReceiverAndSender(updateInvitationDto)
      if (!invitation) {
        throw new NotFoundException('Invitation does not exist')
      }
      return await this.invitationsRepository.remove(invitation)
    } catch (error) {
      throw error
    }
  }

  /**
   * Deletes the invitation the user sent to another user
   * @param updateInvitationDto receiverId, senderId
   */
  async deleteInvitation(updateInvitationDto: UpdateInvitationDto): Promise<void> {
    try {
      const invitation = await this.findByReceiverAndSender(updateInvitationDto)
      this.logger.debug(invitation)
      if (!invitation) {
        throw new NotFoundException('Invitation does not exist')
      }
      await this.invitationsRepository.delete(invitation)
    } catch (error) {
      throw error
    }
  }
}
