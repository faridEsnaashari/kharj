import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            //singleLine: false,
            singleLine: true,
            colorize: true,
            levelFirst: true,
            translateTime: 'yyyy-mm-dd hh:MM:ss',
          },
        },
      },
    }),
  ],
})
export class PinoModule {}
