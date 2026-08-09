import { config } from 'dotenv';
config();

import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { FilteredLogger } from './common/tools/pino/filtered-logger.tool';
import { UncaughtExceptionFilter } from './common/filters/uncaught-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exceptions.filter';
import { ResponseInterceptor } from './common/interseptors/response.interseptor';
import { NestExpressApplication } from '@nestjs/platform-express';
//import { resolve } from 'path';

export function configureApp(app: INestApplication) {
  app.useLogger(new FilteredLogger(app.get(Logger)));

  app.enableCors();

  //  app.useStaticAssets(resolve('./', 'public'));

  app.useGlobalFilters(
    new UncaughtExceptionFilter(),
    new HttpExceptionFilter(),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  return app;
}

export async function createApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  return configureApp(app);
}
