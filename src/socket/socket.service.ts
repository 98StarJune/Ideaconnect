import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MessageEntity } from '../model/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../model/room.entity';
import { UserEntity } from '../model/User.entity';
import { IdeaEntity } from '../model/idea.entity';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { SocketJoinDto } from '../model/dto/request/socket/socket.join.dto';
import { SocketMessageDto } from '../model/dto/request/socket/socket.message.dto';
import { SocketMessageInterface } from '../model/dto/interface/socket.message.interface';
import { SocketJoinResponse } from '../model/dto/response/socket/socket.join.response';

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
    private Resp: SocketJoinResponse,
    private EResp: ErrorResponseDto,
  ) {}
  async join(
    body: SocketJoinDto,
  ): Promise<NormalResponseDto | ErrorResponseDto> {
    //회원 정보 조회
    const user = await this.UserEntity.findOneBy({ _id: body.jwtid });
    if (!user) {
      //회원이 아닌 경우
      this.EResp.statusCode = 401;
      this.EResp.message = '존재하지 않는 회원입니다.';
      return this.EResp;
    }
    //생성된 Room Name이 있는지 조회
    const room = await this.RoomEntity.findOneBy({
      roomname: body.roomname,
    });
    console.log(room);
    if (!room) {
      //일치하는 Room Name이 없을 경우
      this.EResp.statusCode = 404;
      this.EResp.message = '채팅방이 생성되지 않았습니다.';
      return this.EResp;
    } else if (
      room.common_id !== body.jwtid &&
      room.commonfalse_id !== body.jwtid
    ) {
      this.EResp.statusCode = 401;
      this.EResp.message = '허용되지 않은 사용자입니다.';
      return this.EResp;
    }
    this.Resp.statusCode = 200;
    if (user.common === true) {
      this.Resp.nickname = room.commonfalse_nick;
      this.Resp.id = room.commonfalse_id;
    } else {
      this.Resp.nickname = room.common_nick;
      this.Resp.id = room.common_id;
    }
    return this.Resp;
  }
  async message(body: SocketMessageDto): Promise<SocketMessageInterface> {
    //메세지를 DB에 저장
    const message: SocketMessageInterface = {
      roomname: body.roomname,
      date: new Date().toString(),
      sender: body.jwtid,
      message: body.message,
    };
    console.log(message);
    await this.MessageEntity.save(message);
    return message;
  }
}
