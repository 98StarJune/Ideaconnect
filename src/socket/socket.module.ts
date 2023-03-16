import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from '../model/room.entity';
import { MessageEntity } from '../model/message.entity';
import { SocketService } from './socket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity]),
    TypeOrmModule.forFeature([MessageEntity]),
  ],
  providers: [JwtService, SocketGateway, SocketService],
})
export class SocketModule {}
