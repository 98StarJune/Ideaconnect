import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/User.entity';
import { NormalResponseDto } from './model/dto/response/normal.response.dto';
import { ErrorResponseDto } from './model/dto/response/error.response.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtMiddleware } from '../jwt/jwt.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [
    AuthService,
    NormalResponseDto,
    ErrorResponseDto,
    JwtService,
    JwtMiddleware,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).exclude('auth/login').forRoutes('auth/check');
  }
}
