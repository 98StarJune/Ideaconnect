import { Module } from '@nestjs/common';
import { HttpChatController } from './http-chat.controller';
import { HttpChatService } from './http-chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../model/room.entity';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../model/User.entity';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { HttpchatResponseDto } from '../model/dto/response/httpchat.response.dto';
import { IdeaEntity } from '../model/idea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, UserEntity, IdeaEntity])],
  controllers: [HttpChatController],
  providers: [
    HttpChatService,
    JwtService,
    ErrorResponseDto,
    HttpchatResponseDto,
  ],
})
export class HttpChatModule {}
