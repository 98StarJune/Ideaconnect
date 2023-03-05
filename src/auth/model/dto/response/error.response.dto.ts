import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: '에러 코드' })
  protected statusCode: number;
  @ApiProperty({ description: '에러 메세지' })
  protected message: string;
  @ApiProperty({ description: '에러 객체' })
  protected error: object;

  public set(statusCode: number, message: string, Error: object) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = Error;
  }

  get(params: string) {
    switch (params) {
      case 'statusCode':
        return this.statusCode;
      case 'message':
        return this.message;
      default:
        return this.error;
    }
  }
}
