import { Injectable } from '@nestjs/common';
import { HttpchatCreateDto } from '../model/dto/request/httpchat/httpchat.create.dto';
import { Repository } from 'typeorm';
import { RoomEntity } from '../model/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/User.entity';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { chatCreateResponseDto } from '../model/dto/response/chat.create.response.dto';
import { IdeaEntity } from '../model/idea.entity';
import { HttpchatRecordDto } from '../model/dto/request/httpchat/httpchat.record.dto';
import { MessageEntity } from '../model/message.entity';
import { DataResponseDto } from '../model/dto/response/data.response.dto';

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
    const roomname = body.id + '_' + body.jwtid;
    const user = await this.UserEntity.findOneBy({ _id: body.jwtid });
    if (!user) {
      this.ERes.statusCode = 401;
    }
    const roominfo = await this.RoomEntity.findOneBy({ roomname: roomname });
    if (roominfo) {
      this.Res.nickname = user.nickname;
      this.Res.roomname = roomname;
      this.Res.statusCode = 200;
      return this.Res;
    }
    const ideainfo = await this.IdeaEntity.findOneBy({ _id: body.id });
    if (!ideainfo) {
      this.ERes.statusCode = 404;
      return this.ERes;
    }
    const roomvalue = {
      roomname: roomname,
      commonid: ideainfo.creator,
      commonfalseid: body.jwtid,
    };
    await this.RoomEntity.save(roomvalue);
    this.Res.nickname = user.nickname;
    this.Res.roomname = roomname;
    this.Res.statusCode = 201;
    return this.Res;
  }
  async record(
    body: HttpchatRecordDto,
  ): Promise<ErrorResponseDto | DataResponseDto> {
    const record = await this.MessageEntity.findBy({ roomname: body.roomname });
    //메세지 기록이 없을 경우 (undefine)
    if (!record[0]) {
      this.ERes.statusCode = 404;
      return this.ERes;
    }
    this.DRes.statusCode = 200;
    this.DRes.data = record;
    return this.DRes;
  }
}
