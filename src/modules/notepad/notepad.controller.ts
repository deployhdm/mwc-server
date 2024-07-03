import { Body, Controller, Get, HttpStatus, Post, Request, UseInterceptors } from "@nestjs/common";
import { NotepadService } from "./notepad.service";
import { UpdateNoteDto } from "../notes/dto/update-note.dto";
import { BaseResponseInterceptor } from "src/interceptors/base-response.interceptor";

@UseInterceptors(BaseResponseInterceptor)
@Controller('notepad')
export class NotepadController {
    constructor(private readonly notepadService: NotepadService){}

    @Get()
    async findOne(@Request() req) {
        const userId = req.user.id
        if (!userId){
          throw new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
        }
        const notepad = await this.notepadService.findOneByMemberId(userId)
        return { notepad: notepad }
    }

    @Post()
    async update(@Request() req, @Body() updateNotepadDto: UpdateNoteDto) {
        const userId = req.user.id
        if (!userId){
          throw new Response('Not Found',{ 'status': HttpStatus.NOT_FOUND})
        }
        const notepad = await this.notepadService.update(userId, updateNotepadDto)
        return { notepad: notepad }
    }
}