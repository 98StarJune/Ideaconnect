import { ApiProperty } from '@nestjs/swagger';

export class AuthJwtDto {
  @ApiProperty({ description: '토큰 값' })
  private jwt: string;
}
