import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { appConfigs } from './app.configs';
import { Logger } from 'nestjs-pino';
import { Logger as L } from './common/tools/pino/logger.tool';
import { UncaughtExceptionFilter } from './common/filters/uncaught-exceptions.filter';
import { HttpExceptionFilter } from './common/filters/http-exceptions.filter';
import { ResponseInterceptor } from './common/interseptors/response.interseptor';
import { NestExpressApplication } from '@nestjs/platform-express';
//import { resolve } from 'path';

async function bootstrap() {
  config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  app.enableCors();

  //  app.useStaticAssets(resolve('./', 'public'));

  app.useGlobalFilters(
    new UncaughtExceptionFilter(),
    new HttpExceptionFilter(),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  const logger = new L('bootstrap');
  await app.listen(appConfigs.appPort, () =>
    logger.log({
      key: 'MAIN',
      data: { msg: 'app started on port ' + appConfigs.appPort },
    }),
  );
  return;
}
bootstrap();
