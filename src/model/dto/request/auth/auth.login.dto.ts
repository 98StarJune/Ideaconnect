import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../../User.entity';

export class AuthLoginDto extends PickType(UserEntity, ['id', 'pw']) {}
