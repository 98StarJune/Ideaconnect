import { Injectable } from '@nestjs/common';
import { IdeaEntity } from '../../../idea.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';

@Injectable()
export class IdeaCreateDto extends OmitType(IdeaEntity, ['_id']) {
  @ApiProperty({ description: '게시글 고유 번호', deprecated: true })
  _id: number;
}
