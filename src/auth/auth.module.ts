import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../model/User.entity';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtResponseDto } from '../model/dto/response/jwt.response.dto';
import { IdeaEntity } from '../model/idea.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([IdeaEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    NormalResponseDto,
    ErrorResponseDto,
    JwtResponseDto,
    JwtService,
  ],
})
export class AuthModule {}
