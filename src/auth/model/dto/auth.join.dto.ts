import { OmitType, PickType } from '@nestjs/swagger';
import { AuthEntity } from '../auth.entity';

export class AuthJoinDto extends OmitType(AuthEntity, ['_id', 'profileimg']) {}
