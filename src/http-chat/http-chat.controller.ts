import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { JwtauthGuard } from '../jwtauth/jwtauth.guard';
import { HttpChatService } from './http-chat.service';
import { HttpchatCreateDto } from '../model/dto/request/httpchat/httpchat.create.dto';
import { Response } from 'express';
import { HttpchatResponseDto } from '../model/dto/response/httpchat.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';

@Controller('httpchat')
@UseGuards(JwtauthGuard)
export class HttpChatController {
  constructor(
    private readonly httpchatService: HttpChatService,
    private Res: HttpchatResponseDto,
    private ERes: ErrorResponseDto,
  ) {}

  @Post('create')
  async create(@Body() body: HttpchatCreateDto, @Res() res: Response) {
    const result = await this.httpchatService.create(body);
    if (result === this.ERes) {
      return res.status(this.ERes.statusCode).json(this.ERes);
    }
    return res.status(this.Res.statusCode).json(this.Res);
  }
}
