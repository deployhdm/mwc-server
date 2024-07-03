import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notepad } from "./entities/notepad.entity";
import { Repository } from "typeorm";
import { UpdateNotepadDto } from "./dto/update-notepad.dto";
import { CreateNotepadDto } from "./dto/create-notepad.dto";
import { Member } from "../members/entities/member.entity";

@Injectable()
export class NotepadService {
    private logger = new Logger()
    constructor(
        @InjectRepository(Notepad)
        private readonly notepadRepository: Repository<Notepad>
    ){}

    /**
     * Creates a notepad for a Member during its creation
     * @param createNotepadDto 
     * @returns 
     */
    async create(member: Member): Promise<Notepad> {
        this.logger.debug('Creating notepad')
        const createNotepadDto = new CreateNotepadDto()
        createNotepadDto.content = ''
        const notepad = this.notepadRepository.create(createNotepadDto)
        notepad.id = member.id
        notepad.member = member
        return this.notepadRepository.save(notepad)
    }

    async findOneByMemberId(id: number): Promise<Notepad> {
        try {
            return await this.notepadRepository.findOne({ where: { member: { id: id } } })
        } catch (error) {
            throw error
        }
        
    }

    async update(id: number, updateNotepadDto: UpdateNotepadDto): Promise<Notepad> {
        const notepad = await this.notepadRepository.findOne({ where: { member: { id: id } } })
        if (!notepad) {
            throw new NotFoundException(`Notepad with ID ${id} not found`)
        }
        notepad.content = updateNotepadDto.content
        return await this.notepadRepository.save(notepad)
    }
}