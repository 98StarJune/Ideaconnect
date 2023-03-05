import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthJoinDto } from './model/dto/auth.join.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';

@ApiTags('회원 정보 관리')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @ApiOperation({ summary: '회원가입을 처리합니다.' })
  @Post('join')
  async join(@Body() body: AuthJoinDto, @Res() res: Response) {
    const result = await this.authService.join(body);
    return res.status(result.statusCode).json(result.data);
  }
}
