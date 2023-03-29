import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://www.ideaconnect.site',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const config = new DocumentBuilder()
    .setTitle('Idea Connect API Document')
    .setDescription(
      '2023 Google Solution Challenge Project : Created by 배성준',
    )
    .setVersion('0.1.5')
    .addBearerAuth()
    .build();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  const swaggerOptions = {
    swaggerOptions: {
      securityDefinitions: {
        JWT: {
          type: 'apiKey',
          name: 'JWT',
          scheme: 'bearer',
          in: 'header',
        },
      },
    },
  };
  SwaggerModule.setup('apidoc', app, document, swaggerOptions);
  await app.listen(process.env.PORT);
}

bootstrap();
