import { Injectable } from '@nestjs/common';
import { SocketConnectDto } from '../model/dto/request/socket/socket.connect.dto';
import { Repository } from 'typeorm';
import { MessageEntity } from '../model/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../model/room.entity';
import { UserEntity } from '../model/User.entity';
import { IdeaEntity } from '../model/idea.entity';
import { SocketDisconnectDto } from '../model/dto/request/socket/socket.disconnect.dto';
import { MessageInterface } from '../model/dto/request/socket/message.interface';

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
      const roomname = body.idea_id + '_' + id;
      const user = await this.UserEntity.findOneBy({ _id: body.jwtid });
      let room: RoomEntity;
      if (user.common === true) {
        room = await this.RoomEntity.findOneBy({ roomname: body.roomname });
      } else {
        room = await this.RoomEntity.findOneBy({
          roomname,
          commonfalse_id: body.jwtid,
        });
      }
      const idea = await this.IdeaEntity.findOneBy({ _id: body.idea_id });
      if (!room) {
        const Room = {
          roomname: roomname,
          commonid: String(idea._id),
          commonfalse_id: body.jwtid,
        };
        await this.RoomEntity.save(Room);
      }
      idea.connected_user += ',' + body.jwtid;
      await this.IdeaEntity.save(idea);
      return; //roomname;
    } catch (e) {
      return e;
    }
  }
  async disconnect(
    id: string,
    body: SocketDisconnectDto,
  ): Promise<string | boolean | object> {
    try {
      const roomname = body.idea_id + '_' + id;
      const result = await this.RoomEntity.findOneBy({
        roomname,
        commonfalse_id: body.jwtid,
      });
      if (!result) {
        return false;
      }
      return result.roomname;
    } catch (e) {
      return e;
    }
  }
  async send(id: string, body): Promise<MessageInterface> {
    const roomname = body.idea_id + '_' + id;
    const roominfo = await this.RoomEntity.findOneBy({
      roomname: roomname,
      commonfalse_id: body.jwtid,
    });
    if (!roominfo) {
      throw new Error('일치하는 room 정보가 없습니다');
    }
    const message: MessageInterface = {
      roomname: roominfo.roomname,
      date: new Date().toString(),
      sender: body.jwtid,
      message: body.message,
    };
    await this.MessageEntity.save(message);
    return message;
  }

  //async roomname(body) {}
}
