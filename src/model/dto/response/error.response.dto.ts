import { PickType } from '@nestjs/swagger';
import { ResponseEntity } from '../../response.entity';

export class ErrorResponseDto extends PickType(ResponseEntity, [
  'statusCode',
  'message',
  'error',
]) {}
