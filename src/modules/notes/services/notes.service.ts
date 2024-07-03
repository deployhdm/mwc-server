import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { Note } from '../entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MembersService } from 'src/modules/members/services/members.service';

@Injectable()
export class NotesService {
  private logger = new Logger()
  
  constructor( 
    @InjectRepository(Note) 
    private readonly notesRepository: Repository<Note>,
    private readonly membersService: MembersService
  ){}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const { member, sharedWith, ...rest } = createNoteDto;
    const note = this.notesRepository.create(rest);

    if (member) {
      const memberInstance = await this.membersService.findOne(member)
      note.member = memberInstance
    }

    return this.notesRepository.save(note)
  }

  async findAll(): Promise<Note[]> {
    return await this.notesRepository.find()
  }

  async findSubsetIds(noteIds: number[]): Promise<Note[]> {
    return await this.notesRepository.find({ 
      where: { id: In(noteIds) },
    })
  }

  async findAllByMemberId(id: number): Promise<Note[]> {
    return await this.notesRepository.find({ where: { member: { id: id } } })
  }

  async findOne(id: number): Promise<Note> {
    return await this.notesRepository.findOne({ where: {id} })
  }

  async findMemberIdByNoteId(id: number): Promise<number> {
    const note = await this.notesRepository.findOne({ where: {id} })
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`)
    }
    return note.member.id
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: {id} })
    if (!note){
      throw new NotFoundException(`Note with ID ${id} not found`)
    }
    note.title = updateNoteDto.title
    note.content = updateNoteDto.content
    return await this.notesRepository.save(note)
  }

  async incrementCollaboratorCount(id: number): Promise<void> {
    const note = await this.notesRepository.findOne({ where: {id} })
    if (!note){
      throw new NotFoundException(`Note with ID ${id} not found`)
    }
    note.collaboratorCount += 1
    await this.notesRepository.save(note)
  }

  async decrementCollaboratorCount(id: number): Promise<void> {
    const note = await this.notesRepository.findOne({ where: {id} })
    if (!note){
      throw new NotFoundException(`Note with ID ${id} not found`)
    }
    if (note.collaboratorCount < 1) {
      note.collaboratorCount = 0
    } else {
      note.collaboratorCount -= 1
    }
    await this.notesRepository.save(note)
  }

  async remove(id: number): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: {id} })
    if (!note){
      throw new NotFoundException(`Note with ID ${id} not found`)
    }
    return await this.notesRepository.remove(note)
  }

  //return object Note combining the search by the userId and the keyword (in the note content and title)
  async searchUserNotesByKeyword(userId: string, keywordString: string): Promise<Note[]> {
    // this.logger.debug(`Search keyword: ${keywordString}`);
    if (!keywordString) {
      return [];
    }
    const queryBuilder = this.notesRepository.createQueryBuilder('note');
    return queryBuilder
      .where('note.member.id = :userId', { userId })
      .andWhere('(note.title LIKE :keyword OR note.content LIKE :keyword)', { keyword: `%${keywordString}%` })
      .getMany();
  }
}
