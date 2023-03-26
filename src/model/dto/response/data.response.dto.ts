import { ApiProperty, PickType } from '@nestjs/swagger';
import { ResponseEntity } from '../../response.entity';

export class DataResponseDto extends PickType(ResponseEntity, ['statusCode']) {
  @ApiProperty({ description: '데이터 결과값' })
  data: object;
  chat_data: object;
  room_data: object;
  nickname: string;
  _id: string;
}
