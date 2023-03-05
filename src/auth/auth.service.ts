import { HttpCode, Injectable } from '@nestjs/common';
import { AuthJoinDto } from './model/dto/auth.join.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './model/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {
    this.userRepository = userRepository;
  }

  async join(body: AuthJoinDto) {
    try {
      const found = await this.userRepository.findOneBy({ id: body.id });
      if (found) {
        return {
          statusCode: 401,
          data: {
            message: '이미 등록된 사용자입니다.'
          }
        };
      }
      body.pw = await bcrypt.hash(body.pw, 12);
      body._id = "test"
      await this.userRepository.save(body);
      return {
        statusCode: 201,
        data: { message: '정상적으로 등록되었습니다.' }
      };

    } catch (e) {
      console.log(e);
      return {
        statusCode: 500,
        data: {
          message: '서버측 에러가 발생했습니다.',
          error: e
        }
      };
    }
  }
}
