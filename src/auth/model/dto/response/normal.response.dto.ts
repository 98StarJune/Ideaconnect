import { ApiProperty } from '@nestjs/swagger';

export class NormalResponseDto {
  @ApiProperty({ description: '응답 코드' })
  protected statusCode: number;
  @ApiProperty({ description: '응답 메세지' })
  protected message: string;

  set(statusCode: number, Message: string) {
    this.statusCode = statusCode;
    this.message = Message;
  }

  get(params: string) {
    if (params === 'statusCode') {
      return this.statusCode;
    }
    return this.message;
  }
}
