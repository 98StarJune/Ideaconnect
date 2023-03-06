import { OmitType, PickType } from '@nestjs/swagger';
import { UserEntity } from '../../User.entity';

export class AuthJoinDto extends OmitType(UserEntity, ['profileimg']) {}
