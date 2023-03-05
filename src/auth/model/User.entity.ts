import { Column, Entity, Index, PrimaryColumn, Repository } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthJoinDto } from './dto/auth.join.dto';

@Entity()
export class UserEntity {
  @PrimaryColumn()
  @ApiProperty({ description: '유저 고유번호' })
  _id: string;

  @ApiProperty({ description: '일반 사용자일 경우 True', required: true })
  @Column()
  @IsBoolean()
  common: boolean;

  @ApiProperty({ description: '아이디', required: true })
  @Column()
  @Index({ unique: true })
  @IsString()
  id: string;

  @ApiProperty({ description: '비밀번호', required: true })
  @Column()
  @IsString()
  pw: string;

  @ApiProperty({ description: '사용자 이름', required: true })
  @Column()
  @IsString()
  name: string;

  @ApiProperty({ description: '국가 정보', required: true })
  @Column()
  @IsString()
  nation: string;

  @ApiProperty({ description: '이메일', required: true })
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '휴대폰 번호 (국가 코드 불필요)',
    required: true,
  })
  @Column()
  @IsNumber()
  phone: number;

  @ApiProperty({ description: '사용할 닉네임', required: true })
  @Column()
  @IsString()
  nickname: string;

  @ApiProperty({ description: '프로필 이미지 저장 경로' })
  @Column({ default: '/' })
  profileimg: string;
}
