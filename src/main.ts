import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Idea Connect API Document')
    .setDescription(
      '2023 Google Solution Challenge Project : Created by 배성준',
    )
    .setVersion('0.0.1')
    .addTag('ideaconnect')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);
  await app.listen(process.env.PORT);
}

bootstrap();
