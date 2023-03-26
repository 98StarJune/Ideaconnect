import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'process';
import { UserEntity } from './model/User.entity';
import { IdeaModule } from './idea/idea.module';
import { IdeaEntity } from './model/idea.entity';
import { RoomEntity } from './model/room.entity';
import { MessageEntity } from './model/message.entity';
import { SocketModule } from './socket/socket.module';
import { HttpChatModule } from './http-chat/http-chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_ADRESS,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'idea',
      entities: [UserEntity, IdeaEntity, RoomEntity, MessageEntity],
      synchronize: true,
    }),
    AuthModule,
    IdeaModule,
    SocketModule,
    HttpChatModule,
  ],
  controllers: [AppController],
  exports: [ConfigModule],
})
export class AppModule {}
