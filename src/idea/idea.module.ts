import { Module } from '@nestjs/common';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from '../model/idea.entity';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { JwtService } from '@nestjs/jwt';
import { DataResponseDto } from '../model/dto/response/data.response.dto';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity])],
  controllers: [IdeaController],
  providers: [
    IdeaService,
    NormalResponseDto,
    ErrorResponseDto,
    DataResponseDto,
    JwtService,
  ],
})
export class IdeaModule {}
