import { PickType } from '@nestjs/swagger';
import { HttpchatEntity } from '../../../httpchat.entity';

export class HttpchatRecordDto extends PickType(HttpchatEntity, [
  'jwtid',
  'roomname',
]) {}
