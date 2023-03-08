import { ApiProperty } from '@nestjs/swagger';

export class ResponseEntity {
  @ApiProperty({ description: '에러 코드' })
  statusCode: number;
  @ApiProperty({ description: '에러 메세지' })
  message: string;
  @ApiProperty({ description: '에러 객체' })
  error: object;
}
