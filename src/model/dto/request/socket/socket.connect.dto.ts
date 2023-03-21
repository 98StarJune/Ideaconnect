import { SokcetEntity } from '../../../sokcet.entity';
import { OmitType } from '@nestjs/swagger';

export class SocketConnectDto extends OmitType(SokcetEntity, ['roomname']) {}
