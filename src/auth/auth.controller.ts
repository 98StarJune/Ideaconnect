import { Body, Controller, Post } from '@nestjs/common';
import { AuthJoinDto } from './model/dto/auth.join.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: '회원가입을 처리합니다.' })
  @Post('join')
  async join(@Body() body: AuthJoinDto) {
    return '구현중입니다.';
  }
}
