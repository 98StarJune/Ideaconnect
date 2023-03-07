import { Injectable } from '@nestjs/common';
import { IdeaEntity } from '../../../idea.entity';

@Injectable()
export class IdeaCreateDto extends IdeaEntity {}
