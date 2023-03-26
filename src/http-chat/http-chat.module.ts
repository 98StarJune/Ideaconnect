import { Module } from '@nestjs/common';
import { HttpChatController } from './http-chat.controller';
import { HttpChatService } from './http-chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../model/room.entity';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../model/User.entity';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { chatCreateResponseDto } from '../model/dto/response/httpchat/chat.create.response.dto';
import { IdeaEntity } from '../model/idea.entity';
import { MessageEntity } from '../model/message.entity';
import { DataResponseDto } from '../model/dto/response/data.response.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomEntity,
      UserEntity,
      IdeaEntity,
      MessageEntity,
    ]),
  ],
  controllers: [HttpChatController],
  providers: [
    HttpChatService,
    JwtService,
    ErrorResponseDto,
    chatCreateResponseDto,
    DataResponseDto,
  ],
})
export class HttpChatModule {}
