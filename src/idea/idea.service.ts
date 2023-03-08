import { Injectable } from '@nestjs/common';
import { IdeaCreateDto } from '../model/dto/request/idea/idea.create.dto';
import { Repository } from 'typeorm';
import { IdeaEntity } from '../model/idea.entity';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListIdeaResponseDto } from '../model/dto/response/list.idea.response.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    private Resp: NormalResponseDto,
    private EResp: ErrorResponseDto,
  ) {
    this.ideaRepository = ideaRepository;
  } //private
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

  async list(): Promise<
    ListIdeaResponseDto | ErrorResponseDto | NormalResponseDto
  > {
    const test = await this.ideaRepository.find();
    console.log(test);
    return;
  }
}
