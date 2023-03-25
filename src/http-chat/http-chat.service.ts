import { Injectable } from '@nestjs/common';
import { HttpchatCreateDto } from '../model/dto/request/httpchat/httpchat.create.dto';
import { Repository } from 'typeorm';
import { RoomEntity } from '../model/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/User.entity';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { HttpchatResponseDto } from '../model/dto/response/httpchat.response.dto';
import { IdeaEntity } from '../model/idea.entity';

@Injectable()
export class HttpChatService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly RoomEntity: Repository<RoomEntity>,

    @InjectRepository(UserEntity)
    private readonly UserEntity: Repository<UserEntity>,

    @InjectRepository(IdeaEntity)
    private readonly IdeaEntity: Repository<IdeaEntity>,
    private ERes: ErrorResponseDto,
    private Res: HttpchatResponseDto,
  ) {}
  async create(body: HttpchatCreateDto) {
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
}
