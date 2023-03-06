import { Body, Controller, Headers, Post, Res } from '@nestjs/common';
import { AuthJoinDto } from './model/dto/request/auth.join.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { NormalResponseDto } from './model/dto/response/normal.response.dto';
import { ErrorResponseDto } from './model/dto/response/error.response.dto';
import { AuthCheckDto } from './model/dto/request/auth.check.dto';
import { AuthJwtDto } from './model/dto/request/auth.jwt.dto';
import { AuthLoginDto } from './model/dto/request/auth.login.dto';

@ApiTags('회원 정보 관리')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private NormalResponseDto: NormalResponseDto,
    private ErrorResponseDto: ErrorResponseDto,
  ) {}

  @ApiOperation({ summary: '회원가입을 처리합니다.' })
  @ApiResponse({ status: 201, description: '성공', type: NormalResponseDto })
  @ApiResponse({ status: 401, description: 'ID 중복', type: NormalResponseDto })
  @ApiResponse({ status: 500, description: '서버오류', type: ErrorResponseDto })
  @Post('join')
  async join(@Body() body: AuthJoinDto, @Res() res: Response) {
    await this.authService.join(body);
    if (this.NormalResponseDto.get('statusCode')) {
      return res
        .status(<number>this.NormalResponseDto.get('statusCode'))
        .json(this.NormalResponseDto);
    }
    return res
      .status(<number>this.ErrorResponseDto.get('statusCode'))
      .json(this.ErrorResponseDto);
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
  async check(
    @Headers('Authorization') jwt: AuthJwtDto,
    @Body() body: AuthCheckDto,
    @Res() res: Response,
  ) {
    await this.authService.check(jwt, body);
    if (this.NormalResponseDto.get('statusCode')) {
      return res
        .status(<number>this.NormalResponseDto.get('statusCode'))
        .json(this.NormalResponseDto);
    }
    return res
      .status(<number>this.ErrorResponseDto.get('statusCode'))
      .json(this.ErrorResponseDto);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  async login(@Body() body: AuthLoginDto, @Res() res: Response) {
    await this.authService.login(body);
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
