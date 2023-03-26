import { OmitType } from '@nestjs/swagger';
import { MessageEntity } from '../../../message.entity';

export class SocketMessageDto extends OmitType(MessageEntity, ['_id', 'date']) {
  jwtid: string;
}
