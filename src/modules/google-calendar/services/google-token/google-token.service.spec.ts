import { Test, TestingModule } from '@nestjs/testing';
import { GoogleTokenService } from './google-token.service';

describe('GoogleTokenService', () => {
  let service: GoogleTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleTokenService],
    }).compile();

    service = module.get<GoogleTokenService>(GoogleTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
