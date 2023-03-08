import { PickType } from '@nestjs/swagger';
import { ResponseEntity } from '../../response.entity';

export class NormalResponseDto extends PickType(ResponseEntity, [
  'statusCode',
  'message',
]) {}
