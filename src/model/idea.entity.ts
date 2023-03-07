import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@Entity()
export class IdeaEntity {
  jwtid: string;

  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '게시글 고유 번호', deprecated: true })
  _id: string;

  @Column()
  @ApiProperty({ description: '작성자', deprecated: true })
  creator: string;

  @Column()
  @ApiProperty({
    description: '글 제목',
    required: true,
    example: 'UN에서 제시한 문제를 해결합니다',
  })
  @IsString()
  title: string;

  @Column()
  @ApiProperty({
    description: '소개 글',
    required: true,
    example: '제 아이디어를 소개합니다',
  })
  @IsString()
  introduce: string;

  @Column({ type: 'text' })
  @ApiProperty({
    description: '본문',
    required: true,
    example: '제 아이디어는 OOO와 같은 것을 뜻합니다 ...',
  })
  @IsString()
  text: string;

  @Column()
  @ApiProperty({ description: '최초 작성일', deprecated: true })
  first_date: string;

  @Column()
  @ApiProperty({ description: '최근 수정일', deprecated: true })
  update_date: string;

  @Column()
  @ApiProperty({
    description: '아아디어 상태',
    example: ['ready', 'processing', 'complete'],
    deprecated: true,
  })
  status: string;

  @Column({ default: null })
  @ApiProperty({ description: '연결된 자본가(?) 고유번호', deprecated: true })
  connected_user: string;

  @Column()
  @ApiProperty({ description: '조회수', deprecated: true })
  view_counter: number;
}
