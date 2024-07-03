import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersService } from 'src/modules/members/services/members.service';

@Injectable()
export class TasksService {
  constructor( 
    @InjectRepository(Task) 
    private readonly tasksRepository: Repository<Task>,
    private readonly membersService: MembersService
  ){}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { member, MemberIdArray, ...rest } = createTaskDto;
    const task = this.tasksRepository.create(rest);
    if (member) {
      const memberInstance = await this.membersService.findOne(member); 
      task.member = memberInstance;
    }
    if (MemberIdArray){
      const sharewWithMembers = await this.membersService.findSubsetById(MemberIdArray)
      task.sharedWith = sharewWithMembers
    }

    return await this.tasksRepository.save(task)
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find()
  }

  async findOne(id: number): Promise<Task> {
    return await this.tasksRepository.findOne({ where: {id} })
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: {id} })
    if(!task){
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
    // Participants are added to the task
    const sharedWith = updateTaskDto.MemberIdArray
    if (sharedWith) {
      const sharewWithMembers = await this.membersService.findSubsetById(sharedWith)
      task.sharedWith = sharewWithMembers
    }
    Object.assign(task, updateTaskDto)
    return await this.tasksRepository.save(task)
  }

  async remove(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where:{id} })
    if(!task){
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
    return await this.tasksRepository.remove(task)
  }
}
