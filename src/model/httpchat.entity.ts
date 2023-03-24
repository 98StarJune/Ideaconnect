export class HttpchatEntity {
  jwtid: string;
  nickname: string;
  roomname: string;
  statusCode: number;
  /**여기서 부터는 채팅 관련*/
  _id: string; //나의 유저 ID
  message: string;
  sender: string;
  date: string;
}
