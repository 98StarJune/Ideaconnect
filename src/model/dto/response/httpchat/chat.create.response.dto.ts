import { PickType } from '@nestjs/swagger';
import { HttpchatEntity } from '../../../httpchat.entity';

export class chatCreateResponseDto extends PickType(HttpchatEntity, [
  'roomname',
  'statusCode',
]) {}
