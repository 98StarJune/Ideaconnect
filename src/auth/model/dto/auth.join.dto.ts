import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthJoinDto {
  @ApiProperty({ description: '일반 사용자일 경우 True', required: true })
  @IsBoolean()
  common: boolean;

  @ApiProperty({ description: '아이디', required: true })
  @IsString()
  id: string;

  @ApiProperty({ description: '비밀번호', required: true })
  @IsString()
  pw: string;

  @ApiProperty({ description: '사용자 이름', required: true })
  @IsString()
  name: string;

  @ApiProperty({ description: '국가 정보', required: true })
  @IsString()
  nation: string;

  @ApiProperty({ description: '이메일', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '휴대폰 번호 (국가 코드 불필요)', required: true })
  @IsNumber()
  phone: number;

  @ApiProperty({ description: '사용할 닉네임', required: true })
  @IsString()
  nickname: string;
}
