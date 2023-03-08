import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../model/User.entity';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtMiddleware } from '../jwt/jwt.middleware';
import { JwtResponseDto } from '../model/dto/response/jwt.response.dto';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [
    AuthService,
    NormalResponseDto,
    ErrorResponseDto,
    JwtResponseDto,
    JwtService,
    JwtMiddleware,
  ],
})
export class AuthModule {}
