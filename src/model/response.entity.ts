import { ApiProperty } from '@nestjs/swagger';

export class ResponseEntity {
  @ApiProperty({ description: '상태코드' })
  statusCode: number;

  @ApiProperty({ description: '메세지' })
  message: string;

  @ApiProperty({ description: '에러 메세지' })
  error: object;
}
