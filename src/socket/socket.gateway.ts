import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtauthGuard } from '../jwtauth/jwtauth.guard';
import { SocketConnectDto } from '../model/dto/request/socket/socket.connect.dto';
import { SocketService } from './socket.service';

@WebSocketGateway(8088, { cors: '*/*' })
@UseGuards(JwtauthGuard)
export class SocketGateway {
  constructor(private SocketService: SocketService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client, @MessageBody() body): void {
    /*
    body.message = '[백엔드에서 보낸 메세지]' + body.message;
    body.name = '홍길동';
    console.log('body.message : ');
    console.log(body);
    console.log('client ID' + header.id);*/
    this.server.emit('a', body);
    //this.server.to().emit('test', 'test')
  }
  @SubscribeMessage('join')
  join(@ConnectedSocket() client, @MessageBody() body: SocketConnectDto): void {
    this.SocketService.connect(body);
  }
}
