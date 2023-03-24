import { Test, TestingModule } from '@nestjs/testing';
import { HttpChatService } from './http-chat.service';

describe('HttpChatService', () => {
  let service: HttpChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpChatService],
    }).compile();

    service = module.get<HttpChatService>(HttpChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
