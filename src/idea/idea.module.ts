import { Module } from '@nestjs/common';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from '../model/idea.entity';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { JwtMiddleware } from '../jwt/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { dataIdeaDto } from '../model/dto/response/data.idea.dto';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity])],
  controllers: [IdeaController],
  providers: [
    IdeaService,
    NormalResponseDto,
    ErrorResponseDto,
    dataIdeaDto,
    JwtMiddleware,
    JwtService,
  ],
})
export class IdeaModule {}
