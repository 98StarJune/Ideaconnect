import { PickType } from '@nestjs/swagger';
import { ResponseEntity } from '../../response.entity';

export class GauthJoinResponseDto extends PickType(ResponseEntity, [
  'statusCode',
  'message',
]) {
  _id: string;
}
