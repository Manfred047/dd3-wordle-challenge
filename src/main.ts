import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compression from 'compression';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Helper } from './helpers/helper';
import { AppConfigInterface } from './config/interfaces/app.config.interface';

async function bootstrap() {
  // Instance
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('DD3')
    .setDescription('DD3 Wordle Challenge')
    .setVersion('1.0')
    .addTag('dd3')
    .addBearerAuth({
      name: 'authorization',
      type: 'apiKey',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      description:
        'Ingresa el token con el prefijo `Bearer`, ejemplo: Bearer abcde12345',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  // Protector
  app.use(helmet());
  // Compression
  app.use(compression());
  // Cors
  app.enableCors();
  // Global validation
  app.useGlobalPipes(Helper.validationPipe());
  // Global interceptors
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // Get App Config
  const config = app.get(ConfigService);
  const appConfig = config.get<AppConfigInterface>('app');
  // Enable Service
  await app.listen(appConfig.port);
  // Get service url
  const serviceUrl = await app.getUrl();
  Logger.verbose(`DD3 Service working on: ${serviceUrl}`);
}
bootstrap();
