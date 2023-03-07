import { Injectable } from '@nestjs/common';
import { IdeaCreateDto } from '../model/dto/request/idea/idea.create.dto';
import { Repository } from 'typeorm';
import { IdeaEntity } from '../model/idea.entity';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    private ResponseDto: NormalResponseDto,
    private ErrorResponseDto: ErrorResponseDto,
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
      return this.ResponseDto.set(201, '등록되었습니다.');
    } catch (e) {
      return this.ErrorResponseDto.set(500, '서버측 에러가 발생했습니다.', e);
    }
  }
}
