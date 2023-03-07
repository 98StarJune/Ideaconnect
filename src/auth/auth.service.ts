import { Injectable } from '@nestjs/common';
import { AuthJoinDto } from '../model/dto/request/auth/auth.join.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { AuthCheckDto } from '../model/dto/request/auth/auth.check.dto';
import { AuthLoginDto } from '../model/dto/request/auth/auth.login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private ResponseDto: NormalResponseDto,
    private ErrorResponseDto: ErrorResponseDto,
    private jwtService: JwtService,
  ) {
    this.userRepository = userRepository;
  }

  async join(body: AuthJoinDto) {
    try {
      const found = await this.userRepository.findOneBy({ id: body.id });
      if (found) {
        return this.ResponseDto.set(401, '이미 등록된 ID입니다.');
      }
      body.pw = await bcrypt.hash(body.pw, 12);
      while (1) {
        body._id = Math.random().toString(36).slice(2);
        const _idtest = await this.userRepository.findOneBy({ _id: body._id });
        if (!_idtest) {
          break;
        }
      }
      await this.userRepository.save(body);
      return this.ResponseDto.set(201, '정상적으로 등록되었습니다');
    } catch (e) {
      return this.ErrorResponseDto.set(500, '서버측 오류가 발생했습니다', e);
    }
  }

  async check(body: AuthCheckDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: body.jwtid });
      if (!user) {
        return this.ResponseDto.set(401, '일치하지 않습니다.');
      }
      const result = await bcrypt.compare(body.pw, user.pw);
      if (result) {
        return this.ResponseDto.set(201, '일치합니다.');
      }
      return this.ResponseDto.set(401, '일치하지 않습니다.');
    } catch (e) {
      return this.ErrorResponseDto.set(500, '서버측 오류가 발생했습니다', e);
    }
  }

  async login(body: AuthLoginDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: body.id });
      if (!user) {
        return this.ResponseDto.set(401, '입력된 정보가 올바르지 않습니다');
      }
      const checked = await bcrypt.compare(body.pw, user.pw);
      if (checked === false) {
        return this.ResponseDto.set(401, '입력된 정보가 올바르지 않습니다');
      }
      const jwt = this.jwtService.sign(
        { id: body.id },
        { expiresIn: '30m', secret: process.env.SECRET },
      );
      return this.ResponseDto.set(201, jwt);
    } catch (e) {
      return this.ErrorResponseDto.set(500, '서버측 오류가 발생했습니다', e);
    }
  }
}
