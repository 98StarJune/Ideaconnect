import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MessageEntity } from '../model/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../model/room.entity';
import { UserEntity } from '../model/User.entity';
import { IdeaEntity } from '../model/idea.entity';

@Injectable()
export class SocketService {
  constructor(
    @InjectRepository(MessageEntity)
    private MessageEntity: Repository<MessageEntity>,
    @InjectRepository(RoomEntity)
    private RoomEntity: Repository<RoomEntity>,
    @InjectRepository(UserEntity)
    private UserEntity: Repository<UserEntity>,
    @InjectRepository(IdeaEntity)
    private IdeaEntity: Repository<IdeaEntity>,
  ) {}
  async join(body, id) {
    //생성된 Room Name이 있는지 조회
    const { roomname } = await this.RoomEntity.findOneBy({ roomname: body.roomname });
    if(!roomname){
      //Room Name이 생성되지 않은 경우
    }
    return roomname;
  }
}
