import { ApiProperty, PickType } from '@nestjs/swagger';
import { ResponseEntity } from '../../response.entity';

export class ListIdeaResponseDto extends PickType(ResponseEntity, [
  'statusCode',
]) {}
