import { Injectable } from '@nestjs/common';
import { IdeaCreateDto } from '../model/dto/request/idea/idea.create.dto';
import { Repository } from 'typeorm';
import { IdeaEntity } from '../model/idea.entity';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { dataIdeaDto } from '../model/dto/response/data.idea.dto';
import { IdeaOpenoneDto } from '../model/dto/request/idea/idea.openone.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    private Resp: NormalResponseDto,
    private dataResp: dataIdeaDto,
    private EResp: ErrorResponseDto,
  ) {
    this.ideaRepository = ideaRepository;
  }

  async create(body: IdeaCreateDto) {
    body.creator = body.jwtid;
    body.first_date = new Date().toString();
    body.update_date = new Date().toString(); //여기 라인 줄일 수 없나?
    body.status = 'ready';
    body.view_counter = 0;
    try {
      await this.ideaRepository.save(body);
      this.Resp.statusCode = 201;
      this.Resp.message = '정상적으로 등록되었습니다';
      return this.Resp;
    } catch (e) {
      this.EResp.statusCode = 201;
      this.EResp.error = e;
      return this.EResp;
    }
  }

  async list(): Promise<dataIdeaDto | ErrorResponseDto> {
    try {
      const result = await this.ideaRepository.find({
        take: 10,
        select: {
          _id: true,
          creator: true,
          title: true,
          first_date: true,
          update_date: true,
          status: true,
          view_counter: true,
        },
      });
      if (!result[0]) {
        throw new Error('Check Out the Database');
      }
      this.dataResp.statusCode = 201;
      this.dataResp.data = result;
      return this.dataResp;
    } catch (e) {
      console.log(e);
      this.EResp.statusCode = 500;
      this.EResp.error = e;
      return this.EResp;
    }
  }

  async openOne(
    body: IdeaOpenoneDto,
  ): Promise<dataIdeaDto | ErrorResponseDto | NormalResponseDto> {
    try {
      const content = await this.ideaRepository.findOneBy({ _id: body._id });
      if (!content) {
        this.Resp.statusCode = 400;
        this.Resp.message = '게시글이 존재하지 않습니다.';
        return this.Resp;
      }
      this.dataResp.data = content;
      if (
        content.creator !== body.jwtid &&
        content.connected_user !== body.jwtid
      ) {
        content.text = '';
      }
      this.dataResp.statusCode = 201;
      return this.dataResp;
    } catch (e) {
      this.EResp.statusCode = 500;
      this.EResp.error = e;
      return this.EResp;
    }
  }
}
