import { UserEntity } from '../../User.entity';
import { PickType } from '@nestjs/swagger';

export class AuthCheckDto extends PickType(UserEntity, ['pw']) {}
