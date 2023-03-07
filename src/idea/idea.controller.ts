import { Body, Controller, Post, Res } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaCreateDto } from '../model/dto/request/idea/idea.create.dto';
import { Response } from 'express';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';

@Controller('idea')
export class IdeaController {
  constructor(
    private IdeaService: IdeaService,
    private NormalResponseDto: NormalResponseDto,
    private ErrorResponseDto: ErrorResponseDto,
  ) {}

  @Post('create')
  async create(@Body() body: IdeaCreateDto, @Res() res: Response) {
    await this.IdeaService.create(body);
    if (this.NormalResponseDto.get('statusCode')) {
      return res
        .status(<number>this.NormalResponseDto.get('statusCode'))
        .json(this.NormalResponseDto);
    }
    return res
      .status(<number>this.ErrorResponseDto.get('statusCode'))
      .json(this.ErrorResponseDto);
  }
}
