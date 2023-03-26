import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../model/room.entity';
import { MessageEntity } from '../model/message.entity';
import { SocketService } from './socket.service';
import { UserEntity } from '../model/User.entity';
import { IdeaEntity } from '../model/idea.entity';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity]),
    TypeOrmModule.forFeature([MessageEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([IdeaEntity]),
  ],
  providers: [
    JwtService,
    SocketGateway,
    SocketService,
    NormalResponseDto,
    ErrorResponseDto,
  ],
})
export class SocketModule {}
