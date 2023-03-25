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
import { JwtResponseDto } from '../model/dto/response/jwt.response.dto';
import { IdeaEntity } from '../model/idea.entity';
import { HttpService } from '@nestjs/axios';
import { AuthGauthDto } from '../model/dto/request/auth/auth.gauth.dto';
import { GauthJoinResponseDto } from '../model/dto/response/gauth.join.response.dto';
import { AuthGjoinDto } from '../model/dto/request/auth/auth.gjoin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    private httpService: HttpService,
    private jwtService: JwtService,
    private Resp: NormalResponseDto,
    private EResp: ErrorResponseDto,
    private jwtRes: JwtResponseDto,
    private gjoinRes: GauthJoinResponseDto,
  ) {
    this.userRepository = userRepository;
    this.ideaRepository = ideaRepository;
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
  ): Promise<NormalResponseDto | ErrorResponseDto | JwtResponseDto> {
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
        { id: user._id },
        { expiresIn: '30m', secret: process.env.SECRET },
      );
      this.jwtRes.statusCode = 201;
      this.jwtRes.jwt = jwt;
      return this.jwtRes;
    } catch (e) {
      this.EResp.statusCode = 401;
      this.EResp.error = e;
      return this.EResp;
    }
  }

  async out(body) {
    const _id = body.jwtid;
    const pw = body.pw;
    try {
      const user = await this.userRepository.findOneBy({ _id });
      if (!user) {
        this.Resp.statusCode = 401;
        this.Resp.message = '정보가 일치하지 않습니다.';
        return this.Resp;
      }
      const result = await bcrypt.compare(pw, user.pw);
      if (result === false) {
        this.Resp.statusCode = 401;
        this.Resp.message = '정보가 일치하지 않습니다.';
        return this.Resp;
      }
      await this.ideaRepository.delete({ creator: _id });
      await this.userRepository.delete({ _id: _id });

      this.Resp.statusCode = 200;
      this.Resp.message = '처리되었습니다.';
      return this.Resp;
    } catch (e) {
      console.log(e);
      this.EResp.statusCode = 500;
      this.EResp.error = e;
      return this.EResp;
    }
  }
  async gauth(
    body: AuthGauthDto,
  ): Promise<ErrorResponseDto | GauthJoinResponseDto | JwtResponseDto> {
    try {
      const access = await this.httpService.axiosRef.post(
        'https://oauth2.googleapis.com/token',
        {
          code: decodeURI(body.code),
          client_id: process.env.CLIENTID,
          client_secret: process.env.CLIENTSECRET,
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:3000',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      let url = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=';
      url += `${access.data.access_token}`;
      const { data } = await this.httpService.axiosRef.get(url, {
        headers: {
          Authorization: `Bearer ${access.data.access_token}`,
          Accept: 'application/json',
        },
      });
      const user = await this.userRepository.findOneBy({ gid: data.id });
      if (user) {
        /**가입 안됐는데 다시 시도한 경우*/
        if (user.common === null) {
          this.gjoinRes.statusCode = 404;
          this.gjoinRes.message = '회원가입을 진행해주세요.';
          this.gjoinRes._id = user._id;
          this.gjoinRes.name = user.name;
          this.gjoinRes.email = user.email;
          return this.gjoinRes;
        }
      } else {
        /**최초 로그인 시 임시가입 처리*/
        const guser = {
          common: null,
          gid: data.id,
          _id: '',
          name: data.name,
          id: null,
          pw: null,
          nation: null,
          email: data.email,
          phone: null,
          nickname: null,
        };
        while (1) {
          guser._id = Math.random().toString(36).slice(2);
          const _idtest = await this.userRepository.findOneBy({
            _id: guser._id,
          });
          if (!_idtest) {
            break;
          }
        }
        await this.userRepository.save(guser);
        this.gjoinRes.statusCode = 404;
        this.gjoinRes.message = '회원가입을 진행해주세요.';
        this.gjoinRes._id = guser._id;
        this.gjoinRes.name = guser.name;
        this.gjoinRes.email = guser.email;
        return this.gjoinRes;
      }
      const jwt = this.jwtService.sign(
        { id: user._id },
        { expiresIn: '30m', secret: process.env.SECRET },
      );
      this.jwtRes.statusCode = 201;
      this.jwtRes.jwt = jwt;
      return this.jwtRes;
    } catch (e) {
      console.log(e);
      this.EResp.statusCode = 500;
      this.EResp.error = e;
      return this.EResp;
    }
  }
  async gjoin(
    body: AuthGjoinDto,
  ): Promise<NormalResponseDto | ErrorResponseDto> {
    try {
      const user = await this.userRepository.findOneBy({ _id: body._id });
      if (!user) {
        this.EResp.statusCode = 404;
        this.EResp.message = '존재하지 않는 사용자입니다.';
        return this.EResp;
      }
      body.pw = await bcrypt.hash(body.pw, 12);
      await this.userRepository.save(body);
      this.Resp.statusCode = 200;
      this.Resp.message = '정상적으로 등록되었습니다.';
      return this.Resp;
    } catch (e) {
      this.EResp.statusCode = 500;
      this.EResp.error = e;
      return this.EResp;
    }
  }
}
