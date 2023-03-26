import { Injectable } from '@nestjs/common';
import { HttpchatCreateDto } from '../model/dto/request/httpchat/httpchat.create.dto';
import { Repository } from 'typeorm';
import { RoomEntity } from '../model/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/User.entity';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { chatCreateResponseDto } from '../model/dto/response/httpchat/chat.create.response.dto';
import { IdeaEntity } from '../model/idea.entity';
import { HttpchatRecordDto } from '../model/dto/request/httpchat/httpchat.record.dto';
import { MessageEntity } from '../model/message.entity';
import { DataResponseDto } from '../model/dto/response/data.response.dto';
import { RoomDataInterface } from '../model/dto/interface/room.data.interface';

@Injectable()
export class HttpChatService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly RoomEntity: Repository<RoomEntity>,
    @InjectRepository(UserEntity)
    private readonly UserEntity: Repository<UserEntity>,
    @InjectRepository(IdeaEntity)
    private readonly IdeaEntity: Repository<IdeaEntity>,
    @InjectRepository(MessageEntity)
    private readonly MessageEntity: Repository<MessageEntity>,
    private ERes: ErrorResponseDto,
    private Res: chatCreateResponseDto,
    private DRes: DataResponseDto,
  ) {}
  async create(
    body: HttpchatCreateDto,
  ): Promise<ErrorResponseDto | chatCreateResponseDto> {
    //Common 값이 False 인 투자자만 본 메서드를 이용할 수 있다.
    //룸 이름 : 게시글 고유 번호 + common false의 고유 번호
    const roomname = body.id + '_' + body.jwtid;
    //고유 번호 기반 요청자 정보 조회
    const user = await this.UserEntity.findOneBy({ _id: body.jwtid });
    if (!user) {
      //회원 정보가 없을 경우
      this.ERes.statusCode = 401;
      return this.ERes;
    }
    if (user.common === true) {
      //아이디어 등록자 (common true)인 경우 거부 처리
      this.ERes.statusCode = 402;
      this.ERes.message = '아이디어 등록자는 사용할 수 없습니다.';
      return this.ERes;
    }
    //룸 이름이 이미 생성되어 있는지 조회
    const roominfo = await this.RoomEntity.findOneBy({ roomname: roomname });
    if (roominfo) {
      //이미 있는 경우의 반환
      this.Res.roomname = roomname;
      this.Res.statusCode = 200;
      return this.Res;
    }
    //아이디어 고유번호 조회
    const ideainfo = await this.IdeaEntity.findOneBy({ _id: body.id });
    if (!ideainfo) {
      //게시글이 존재하지 않는 경우
      this.ERes.statusCode = 404;
      return this.ERes;
    }
    //회원 맞고, 아이디어 있고, 룸이 없을 경우 새롭게 생성
    const { nickname } = await this.UserEntity.findOneBy({
      _id: ideainfo.creator,
    });
    const roomvalue = {
      roomname: roomname,
      common_id: ideainfo.creator,
      common_nick: nickname,
      commonfalse_id: body.jwtid,
      commonfalse_nick: user.nickname,
    };
    await this.RoomEntity.save(roomvalue);
    this.Res.roomname = roomname;
    this.Res.nickname = ideainfo.creator;
    this.Res.statusCode = 201;
    return this.Res;
  }
  async record(
    body: HttpchatRecordDto,
  ): Promise<ErrorResponseDto | DataResponseDto> {
    //유저 정보 조회
    const user = await this.UserEntity.findOneBy({ _id: body.jwtid });
    if (!user) {
      //등록된 유저가 아닌 경우
      this.ERes.statusCode = 402;
      this.ERes.message = '존재하지 않는 사용자입니다.';
      return this.ERes;
    }
    //메세지 기록 조회 (Proxy 패턴 구현 생략)
    const record = await this.MessageEntity.findBy({ roomname: body.roomname });
    //메세지 기록이 없을 경우 (undefine)
    if (!record[0]) {
      this.ERes.statusCode = 404;
      return this.ERes;
    }
    //룸 정보 조회
    const room = await this.RoomEntity.findOneBy({
      roomname: record[0].roomname,
    });
    this.DRes.statusCode = 200;
    this.DRes.chat_data = record;
    this.DRes.room_data = room;
    return this.DRes;
  }
  async list(jwt): Promise<ErrorResponseDto | DataResponseDto> {
    //고유 번호 기반 요청자 정보 조회
    const user = await this.UserEntity.findOneBy({ _id: jwt });
    //User 정보가 조회되지 않았을 경우 (null)
    if (!user) {
      this.ERes.statusCode = 401;
      this.ERes.message = '존재하지 않는 사용자입니다.';
      return this.ERes;
    }
    let rooms;
    if (user.common === true) {
      //아이디어 등록자일 경우
      rooms = await this.RoomEntity.findBy({ common_id: jwt });
    } else {
      //자본가 일 경우
      rooms = await this.RoomEntity.findBy({ commonfalse_id: jwt });
    }
    if (!rooms[0]) {
      //룸 정보가 없을 경우
      this.ERes.statusCode = 404;
      return this.ERes;
    }
    const data: RoomDataInterface[] = [];
    for (const dataKey in rooms) {
      //상대방의 정보만 담아서 response 하도록 배열에 저장
      if (user.common === true) {
        const temp: RoomDataInterface = {
          roomname: rooms[dataKey].roomname,
          id: rooms[dataKey].commonfalse_id,
          nickname: rooms[dataKey].commonfalse_nick,
        };
        data.push(temp);
      } else {
        // console.log(rooms[dataKey].roonname)
        const temp: RoomDataInterface = {
          roomname: rooms[dataKey].roomname,
          id: rooms[dataKey].common_id,
          nickname: rooms[dataKey].common_nick,
        };
        data.push(temp);
      }
    }
    this.DRes.statusCode = 200;
    this.DRes.room_data = data;
    return this.DRes;
  }
}
