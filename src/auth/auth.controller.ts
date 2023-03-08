import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthJoinDto } from '../model/dto/request/auth/auth.join.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { AuthCheckDto } from '../model/dto/request/auth/auth.check.dto';
import { AuthLoginDto } from '../model/dto/request/auth/auth.login.dto';

@ApiTags('회원 정보')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private Resp: NormalResponseDto,
    private EResp: ErrorResponseDto,
  ) {}

  @ApiOperation({ summary: '회원가입을 처리합니다.' })
  @ApiResponse({ status: 201, description: '성공', type: NormalResponseDto })
  @ApiResponse({ status: 401, description: 'ID 중복', type: NormalResponseDto })
  @ApiResponse({ status: 500, description: '서버오류', type: ErrorResponseDto })
  @Post('join')
  async join(@Body() body: AuthJoinDto, @Res() res: Response) {
    const result = await this.authService.join(body);
    // console.log(result === this.Resp);
    if (result !== this.Resp) {
      return res.status(this.EResp.statusCode).json(this.EResp);
    }
    return res.status(this.Resp.statusCode).json(this.Resp);
  }

  @Post('check')
  @ApiOperation({ summary: 'ID 및 Pw의 일치 여부를 확인합니다' })
  @ApiResponse({ status: 201, description: '일치', type: NormalResponseDto })
  @ApiResponse({
    status: 401,
    description: 'ID 또는 PW가 일치하지 않음',
    type: NormalResponseDto,
  })
  @ApiResponse({ status: 501, description: '서버오류', type: ErrorResponseDto })
  @ApiSecurity('JWT')
  async check(@Body() body: AuthCheckDto, @Res() res: Response) {
    const result = await this.authService.check(body);
    if (result !== this.Resp) {
      return res.status(this.EResp.statusCode).json(this.EResp);
    }
    return res.status(this.Resp.statusCode).json(this.Resp);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  async login(@Body() body: AuthLoginDto, @Res() res: Response) {
    const result = await this.authService.login(body);
    if (result !== this.Resp) {
      return res.status(this.EResp.statusCode).json(this.EResp);
    }
    return res.status(this.Resp.statusCode).json(this.Resp);
  }
}
