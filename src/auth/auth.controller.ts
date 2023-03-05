import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthJoinDto } from './model/dto/request/auth.join.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { NormalResponseDto } from './model/dto/response/normal.response.dto';
import { ErrorResponseDto } from './model/dto/response/error.response.dto';

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
}
