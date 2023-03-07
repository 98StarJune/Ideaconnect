import { Body, Controller, Post, Res } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaCreateDto } from '../model/dto/request/idea/idea.create.dto';
import { Response } from 'express';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('아이디어 게시물 정보')
@Controller('idea')
@ApiSecurity('JWT')
export class IdeaController {
  constructor(
    private IdeaService: IdeaService,
    private NormalResponseDto: NormalResponseDto,
    private ErrorResponseDto: ErrorResponseDto,
  ) {}

  @Post('create')
  @ApiOperation({ summary: '아이디어 게시물을 생성합니다' })
  @ApiResponse({
    status: 201,
    description: '정상등록',
    type: NormalResponseDto,
  })
  @ApiResponse({ status: 500, description: '서버에러', type: ErrorResponseDto })
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
