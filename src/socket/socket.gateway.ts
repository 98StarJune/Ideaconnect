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
import { SocketConnectDto } from '../model/dto/request/socket/socket.connect.dto';
import { SocketService } from './socket.service';
import { SocketDisconnectDto } from '../model/dto/request/socket/socket.disconnect.dto';

@WebSocketGateway(8088, { cors: '*/*' })
@UseGuards(JwtauthGuard)
export class SocketGateway {
  constructor(private SocketService: SocketService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: SocketConnectDto,
  ): void {
    this.server.emit('a', body);
  }

  @SubscribeMessage('join')
  async join(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: SocketConnectDto,
  ): Promise<void> {
    const result = await this.SocketService.connect(client.id, body);
    if (typeof result === 'string') {
      this.server.socketsJoin(result);
    } else {
      this.server.emit('error', result, '에러가 발생했습니다.');
    }
  }

  @SubscribeMessage('out')
  async disconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: SocketDisconnectDto,
  ): Promise<void> {
    const result = await this.SocketService.disconnect(client.id, body);
    if (typeof result === 'string') {
      this.server.socketsLeave(result);
    } else {
      this.server.emit('error', result, '에러가 발생했습니다.');
    }
  }
  @SubscribeMessage('send')
  async send(
    @ConnectedSocket() client: Socket,
    @MessageBody() body,
  ): Promise<void> {
    const result = await this.SocketService.send(client.id, body);
    if (typeof result === 'boolean') {
      this.server.emit('error', '에러가 발생했습니다.');
    } else {
      this.server.to(result.roomname).emit('message', result);
    }
  }
}
