import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthJoinDto } from './model/auth.join.dto';

@Controller('auth')
export class AuthController {
  @Post('join')
  async join(@Body() body: AuthJoinDto) {
    return '구현중입니다.';
  }
}
