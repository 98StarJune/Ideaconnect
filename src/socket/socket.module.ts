import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../model/room.entity';
import { MessageEntity } from '../model/message.entity';
import { SocketService } from './socket.service';
import { UserEntity } from '../model/User.entity';
import { IdeaEntity } from '../model/idea.entity';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { SocketJoinResponse } from '../model/dto/response/socket/socket.join.response';

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
    ErrorResponseDto,
    SocketJoinResponse,
  ],
})
export class SocketModule {}
