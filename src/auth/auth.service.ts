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
    private Resp: NormalResponseDto,
    private EResp: ErrorResponseDto,
    private jwtService: JwtService,
  ) {
    this.userRepository = userRepository;
  }

  async join(body: AuthJoinDto): Promise<NormalResponseDto | ErrorResponseDto> {
    try {
      const found = await this.userRepository.findOneBy({ id: body.id });
      if (found) {
        this.Resp.statusCode = 401;
        this.Resp.message = '이미 등록된 ID입니다.';
        return this.Resp;
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
      this.Resp.statusCode = 201;
      this.Resp.message = '정상적으로 등록되었습니다';
      return this.Resp;
    } catch (e) {
      this.EResp.message = '서버측 오류가 발생했습니다';
      this.EResp.error = e;
      return this.EResp;
    }
  }

  async check(
    body: AuthCheckDto,
  ): Promise<NormalResponseDto | ErrorResponseDto> {
    try {
      const user = await this.userRepository.findOneBy({ id: body.jwtid });
      if (!user) {
        this.Resp.statusCode = 401;
        this.Resp.message = '일치하지 않습니다.';
        return this.Resp;
      }
      const result = await bcrypt.compare(body.pw, user.pw);
      if (result) {
        this.Resp.statusCode = 201;
        this.Resp.message = '일치합니다';
        return this.Resp;
      }
      this.Resp.statusCode = 401;
      this.Resp.message = '일치하지 않습니다.';
      return this.Resp;
    } catch (e) {
      this.EResp.statusCode = 500;
      this.EResp.error = e;
      return this.EResp;
    }
  }

  async login(
    body: AuthLoginDto,
  ): Promise<NormalResponseDto | ErrorResponseDto> {
    try {
      const user = await this.userRepository.findOneBy({ id: body.id });
      if (!user) {
        this.Resp.statusCode = 401;
        this.Resp.message = '입력된 정보가 올바르지 않습니다.';
        return this.Resp;
      }
      const checked = await bcrypt.compare(body.pw, user.pw);
      if (checked === false) {
        this.Resp.statusCode = 401;
        this.Resp.message = '입력된 정보가 올바르지 않습니다.';
        return this.Resp;
      }
      const jwt = this.jwtService.sign(
        { id: body.id },
        { expiresIn: '30m', secret: process.env.SECRET },
      );
      this.Resp.statusCode = 201;
      this.Resp.message = jwt; //여기는 JWT 전용 Return Dto를 생성하자
      return this.Resp;
    } catch (e) {
      this.EResp.statusCode = 401;
      this.EResp.error = e;
      return this.EResp;
    }
  }
}
