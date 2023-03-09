import { PickType } from '@nestjs/swagger';
import { IdeaEntity } from '../../../idea.entity';

export class IdeaOpenoneDto extends PickType(IdeaEntity, ['jwtid', '_id']) {}
