import { Injectable } from '@nestjs/common';
import { SocketConnectDto } from '../model/dto/request/socket/socket.connect.dto';
import { Repository } from 'typeorm';
import { MessageEntity } from '../model/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../model/room.entity';
import { UserEntity } from '../model/User.entity';
import { IdeaEntity } from '../model/idea.entity';
import { SocketDisconnectDto } from '../model/dto/request/socket/socket.disconnect.dto';

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

  async connect(id: string, body: SocketConnectDto): Promise<string | object> {
    try {
      const roomname = body._id + '_' + id;
      const user = await this.UserEntity.findOneBy({ id: body.jwtid });
      let room: RoomEntity;
      /**일반 사용자 일 경우*/
      if (user.common === true) {
        room = await this.RoomEntity.findOneBy({ roomname });
      } else {
        room = await this.RoomEntity.findOneBy({
          roomname,
          commonfalseid: body.jwtid,
        });
      }
      const idea = await this.IdeaEntity.findOneBy({ _id: body._id });
      if (!room) {
        const Room = {
          roomname,
          commonid: idea._id,
          commonfalseid: body.jwtid,
        };
        await this.RoomEntity.save(Room);
      }
      //연결된
      /*idea.connected_user += ',' + body.jwtid;
      await this.IdeaEntity.save(idea);*/
      return roomname;
    } catch (e) {
      return e;
    }
  }
  async disconnect(
    id: string,
    body: SocketDisconnectDto,
  ): Promise<string | boolean | object> {
    try {
      const result = await this.RoomEntity.findOneBy({
        roomname: body.roomname,
        commonfalseid: body.jwtid,
      });
      if (!result) {
        return false;
      }
      return result.roomname;
    } catch (e) {
      return e;
    }
  }

  async send(id: string, body): Promise<string> {
    return '개발 중입니다';
  }
}
