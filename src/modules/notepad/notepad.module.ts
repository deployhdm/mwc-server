import { Module } from '@nestjs/common';
import { NotepadService } from './notepad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notepad } from './entities/notepad.entity';
import { NotepadController } from './notepad.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Notepad])],
    controllers: [NotepadController],
    providers: [NotepadService],
    exports: [TypeOrmModule, NotepadService]
})
export class NotepadModule {}
