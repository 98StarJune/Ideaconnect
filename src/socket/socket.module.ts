import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [SocketGateway],
  providers: [JwtService],
})
export class SocketModule {}
