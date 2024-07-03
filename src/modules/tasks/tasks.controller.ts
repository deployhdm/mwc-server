import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MembersService } from '../members/services/members.service';
import { BaseResponseInterceptor } from 'src/interceptors/base-response.interceptor';

@UseInterceptors(BaseResponseInterceptor)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly membersService: MembersService
  ) {}

  @Post()
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    const userId = req.user.id
    createTaskDto.member = userId
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id
    const tasks = await this.membersService.findUserTasks(userId)
    return {tasks: tasks}
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(+id)
    return { task : [task] }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(+id);
  }
}
