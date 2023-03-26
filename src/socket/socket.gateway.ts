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

@WebSocketGateway(8088, { cors: '*/*' })
@UseGuards(JwtauthGuard)
export class SocketGateway {
  constructor(private SocketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  async join(@MessageBody() body, @ConnectedSocket() client: Socket){
    console.log(client.id);
    const result = await this.SocketService.join(body, client);
    if(typeof result === 'boolean'){
      const object = {statusCode : 404};
      return this.server.emit('response', object);
    }
  }
}
