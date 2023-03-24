import { Test, TestingModule } from '@nestjs/testing';
import { HttpChatController } from './http-chat.controller';

describe('HttpChatController', () => {
  let controller: HttpChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HttpChatController],
    }).compile();

    controller = module.get<HttpChatController>(HttpChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
