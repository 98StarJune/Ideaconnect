import { Body, Controller, Get, Post, Res } from '@nestjs/common';
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
import { dataIdeaDto } from '../model/dto/response/data.idea.dto';

@ApiTags('아이디어 게시물 정보')
@Controller('idea')
@ApiSecurity('JWT')
export class IdeaController {
  constructor(
    private IdeaService: IdeaService,
    private Resp: NormalResponseDto,
    private EResp: ErrorResponseDto,
    private IdeaResp: dataIdeaDto,
  ) {}

  @Post('create')
  @ApiOperation({ summary: '아이디어 게시물을 생성합니다' })
  @ApiResponse({
    status: 201,
    description: '정상등록',
    type: NormalResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'JWT 오류',
    type: ErrorResponseDto,
  })
  @ApiResponse({ status: 500, description: '서버에러', type: ErrorResponseDto })
  async create(@Body() body: IdeaCreateDto, @Res() res: Response) {
    const result = await this.IdeaService.create(body);
    if (result !== this.Resp) {
      return res.status(this.EResp.statusCode).json(this.EResp);
    }
    return res.status(this.Resp.statusCode).json(this.Resp);
  }
  @Get('list')
  @ApiOperation({ summary: '게시글 목록을 조회합니다.' })
  @ApiResponse({
    status: 201,
    description: '조회 완료',
    type: dataIdeaDto,
  })
  @ApiResponse({
    status: 401,
    description: 'JWT 오류',
    type: ErrorResponseDto,
  })
  async list(@Res() res: Response) {
    const result = await this.IdeaService.list();
    switch (result) {
      case this.IdeaResp:
        return res.status(this.IdeaResp.statusCode).json(this.IdeaResp);
      case this.EResp:
        return res.status(this.EResp.statusCode).json(this.EResp.error);
      default:
        return res
          .status(500)
          .json({ message: '알 수 없는 오류가 발생했습니다.' });
    }
  }
}
