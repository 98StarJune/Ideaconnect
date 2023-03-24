import { PickType } from '@nestjs/swagger';
import { HttpchatEntity } from '../../httpchat.entity';

export class HttpchatResponseDto extends PickType(HttpchatEntity, [
  'nickname',
  'roomname',
  'statusCode',
]) {}
