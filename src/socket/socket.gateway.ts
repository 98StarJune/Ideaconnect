import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UseGuards } from '@nestjs/common';
import { JwtauthGuard } from '../jwtauth/jwtauth.guard';

@WebSocketGateway(8088, { cors: '*/*' })
@UseGuards(JwtauthGuard)
export class SocketGateway {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body, @ConnectedSocket() client): void {
    body.message = '[백엔드에서 보낸 메세지]' + body.message;
    body.name = '홍길동';
    console.log('body.message : ');
    console.log(body);
    console.log('client ID' + client.id);
    this.server.emit('a', body);
  }
}
