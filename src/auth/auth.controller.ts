import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
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
import { JwtResponseDto } from '../model/dto/response/jwt.response.dto';
import { JwtauthGuard } from '../jwtauth/jwtauth.guard';

@ApiTags('회원 정보')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private Resp: NormalResponseDto,
    private EResp: ErrorResponseDto,
    private jwtRes: JwtResponseDto,
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
  @UseGuards(JwtauthGuard)
  @ApiOperation({ summary: 'ID 및 Pw의 일치 여부를 확인합니다' })
  @ApiResponse({ status: 201, description: '일치', type: NormalResponseDto })
  @ApiResponse({
    status: 400,
    description: 'JWT 오류',
    type: ErrorResponseDto,
  })
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
  @ApiResponse({ status: 201, description: '일치', type: JwtResponseDto })
  @ApiResponse({
    status: 401,
    description: 'ID 또는 PW 불일치',
    type: NormalResponseDto,
  })
  @ApiResponse({ status: 500, description: '서버오류', type: ErrorResponseDto })
  async login(@Body() body: AuthLoginDto, @Res() res: Response) {
    const result = await this.authService.login(body);
    switch (result) {
      case this.Resp:
        return res.status(this.EResp.statusCode).json(this.EResp);
      case this.EResp:
        return res.status(this.Resp.statusCode).json(this.Resp);
      case this.jwtRes:
        return res.status(this.jwtRes.statusCode).json(this.jwtRes);
      default:
        return res
          .status(500)
          .json({ message: '알 수 없는 오류가 발생했습니다.' });
    }
  }

  @Post('out')
  @UseGuards(JwtauthGuard)
  @ApiSecurity('JWT')
  @ApiOperation({ summary: '탈퇴 처리합니다.' })
  @ApiResponse({ status: 201, description: '성공', type: NormalResponseDto })
  @ApiResponse({
    status: 400,
    description: 'JWT 오류',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '정보가 일치하지 않습니다.',
    type: NormalResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 오류',
    type: ErrorResponseDto,
  })
  async out(@Res() res: Response, @Body() body: AuthCheckDto) {
    const result = await this.authService.out(body);
    if (result === this.Resp) {
      return res.status(this.Resp.statusCode).json(this.Resp);
    }
    return res.status(this.EResp.statusCode).json(this.EResp);
  }
}
