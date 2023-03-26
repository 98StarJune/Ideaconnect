import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtauthGuard } from '../jwtauth/jwtauth.guard';
import { SocketService } from './socket.service';
import { NormalResponseDto } from '../model/dto/response/normal.response.dto';
import { ErrorResponseDto } from '../model/dto/response/error.response.dto';
import { SocketJoinDto } from '../model/dto/request/socket/socket.join.dto';
import { SocketMessageDto } from '../model/dto/request/socket/socket.message.dto';

@WebSocketGateway(8088, { cors: '*/*' })
@UseGuards(JwtauthGuard)
export class SocketGateway {
  constructor(
    private SocketService: SocketService,
    private readonly Resp: NormalResponseDto,
    private readonly EResp: ErrorResponseDto,
  ) {}

  @WebSocketServer()
  server: Server;
  @SubscribeMessage('join')
  async join(
    @MessageBody() body: SocketJoinDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('1. Join 메세지가 감지되었습니다');
    console.log(body);
    const result = await this.SocketService.join(body);
    if (result === this.EResp) {
      return this.server.emit('response', this.EResp);
    }
    await client.join(body.roomname);
  }

  @SubscribeMessage('message')
  async message(
    @MessageBody() body: SocketMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('1. message 메세지가 감지되었습니다.');
    console.log(body);
    console.log(body.roomname);
    //room에 client가 연결되어 있는지 확인
    console.log('2. 룸연결 상태 확인');
    const isJoined = this.server
      .of('/')
      .adapter.rooms.get(body.roomname)
      .has(client.id);
    console.log(isJoined);
    if (isJoined === false) {
      //room에 client가 연결되지 않은 경우 처리
      this.EResp.statusCode = 401;
      this.EResp.message = '채팅방에 연결되지 않았습니다.';
      return client.emit('message', this.EResp);
    }
    const result = await this.SocketService.message(body);
    console.log('5. 완료');
    const value = client.to(body.roomname).emit('message', result);
    console.log(value);
  }
  @SubscribeMessage('out')
  async out(@MessageBody() body, @ConnectedSocket() client) {
    console.log('out 메세지가 감지되었습니다.');
    //room에 client가 연결되어 있는지 확인
    const isJoined = this.server
      .of('/')
      .adapter.rooms.get(body.roomname)
      .has(client.id);
    if (isJoined === false) {
      //room에 client가 연결되지 않은 경우 처리
      this.EResp.statusCode = 401;
      this.EResp.message = '채팅방에 연결되지 않았습니다.';
      return client.emit('response', this.EResp);
    }
    this.Resp.statusCode = 200;
    return client.leave(body.roomname).emit('message', this.Resp);
  }
}
