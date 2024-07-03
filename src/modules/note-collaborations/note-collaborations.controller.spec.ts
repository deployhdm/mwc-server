import { Test, TestingModule } from '@nestjs/testing';
import { NoteCollaborationsController } from './note-collaborations.controller';
import { NoteCollaborationsService } from './note-collaborations.service';

describe('NoteCollaborationsController', () => {
  let controller: NoteCollaborationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteCollaborationsController],
      providers: [NoteCollaborationsService],
    }).compile();

    controller = module.get<NoteCollaborationsController>(NoteCollaborationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
