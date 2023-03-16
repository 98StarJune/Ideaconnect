import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserEntity } from '../../../User.entity';

export class AuthGjoinDto extends OmitType(UserEntity, [
  'gid',
  'name',
  'email',
  'jwtid',
  '_id',
]) {
  @ApiProperty({
    description: '유저 고유번호',
    required: true,
  })
  _id: string;
}
