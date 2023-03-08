import { PickType } from '@nestjs/swagger';
import { ResponseEntity } from '../../response.entity';

export class JwtResponseDto extends PickType(ResponseEntity, [
  'statusCode',
  'jwt',
]) {}
