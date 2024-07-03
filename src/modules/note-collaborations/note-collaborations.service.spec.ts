import { Test, TestingModule } from '@nestjs/testing';
import { NoteCollaborationsService } from './note-collaborations.service';

describe('NoteCollaborationsService', () => {
  let service: NoteCollaborationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoteCollaborationsService],
    }).compile();

    service = module.get<NoteCollaborationsService>(NoteCollaborationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
