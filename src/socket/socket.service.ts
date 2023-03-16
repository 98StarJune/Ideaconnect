import { Injectable } from '@nestjs/common';
import { SocketConnectDto } from '../model/dto/request/socket/socket.connect.dto';
import { Repository } from 'typeorm';
import { MessageEntity } from '../model/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../model/room.entity';

@Injectable()
export class SocketService {
  constructor(
    @InjectRepository(MessageEntity)
    private MessageEntity: Repository<MessageEntity>,
    @InjectRepository(RoomEntity)
    private RoomEntity: Repository<RoomEntity>,
  ) {}
  connect(body: SocketConnectDto) {
    if (body.common === false) {
      const roomName = body._id + body.jwtid;
    } else {
    }
  }
}
