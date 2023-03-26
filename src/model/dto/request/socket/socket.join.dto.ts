import { PickType } from '@nestjs/swagger';
import { SokcetEntity } from '../../../sokcet.entity';

export class SocketJoinDto extends PickType(SokcetEntity, [
  'roomname',
  'jwtid',
]) {}
