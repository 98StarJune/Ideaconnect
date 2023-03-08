import { ApiProperty, PickType } from '@nestjs/swagger';
import { ResponseEntity } from '../../response.entity';

export class dataIdeaDto extends PickType(ResponseEntity, ['statusCode']) {
  @ApiProperty({ description: '데이터 결과값' })
  data: object;
}
