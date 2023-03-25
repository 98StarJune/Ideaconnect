import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { JwtauthGuard } from '../jwtauth/jwtauth.guard';
import { HttpChatService } from './http-chat.service';
import { HttpchatCreateDto } from '../model/dto/request/httpchat/httpchat.create.dto';
import { Response } from 'express';
import { chatCreateResponseDto } from '../model/dto/response/chat.create.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { HttpchatRecordDto } from '../model/dto/request/httpchat/httpchat.record.dto';
import { DataResponseDto } from '../model/dto/response/data.response.dto';

@Controller('httpchat')
@UseGuards(JwtauthGuard)
export class HttpChatController {
  constructor(
    private readonly httpchatService: HttpChatService,
    private Res: chatCreateResponseDto,
    private ERes: ErrorResponseDto,
    private DRes: DataResponseDto,
  ) {}

  @Post('create')
  async create(@Body() body: HttpchatCreateDto, @Res() res: Response) {
    const result = await this.httpchatService.create(body);
    if (result === this.ERes) {
      return res.status(this.ERes.statusCode).json(this.ERes);
    }
    return res.status(this.Res.statusCode).json(this.Res);
  }

  @Post('record')
  async record(@Body() body: HttpchatRecordDto, @Res() res: Response) {
    const result = await this.httpchatService.record(body);
    if (result === this.ERes) {
      return res.status(this.ERes.statusCode).json(this.ERes);
    }
    return res.status(this.DRes.statusCode).json(this.DRes);
  }

  @Get('list')
  async list(@Body('jwtid') jwt, @Res() res: Response) {
    const result = await this.httpchatService.list(jwt);
    if (result === this.ERes) {
      return res.status(this.ERes.statusCode).json(this.ERes);
    }
    return res.status(this.DRes.statusCode).json(this.DRes);
  }
}
