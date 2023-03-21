import { SokcetEntity } from '../../../sokcet.entity';
import { OmitType } from '@nestjs/swagger';

export class SocketDisconnectDto extends OmitType(SokcetEntity, ['message']) {}
