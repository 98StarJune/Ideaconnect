import { NormalResponseDto } from '../normal.response.dto';

export class SocketJoinResponse extends NormalResponseDto {
  nickname: string;
  id: string;
}
