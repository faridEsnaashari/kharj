import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { Logger } from 'src/common/tools/pino/logger.tool';

@Catch()
export class UncaughtExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger('UNCAUGHT_EXCEPTION');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    //eslint-disable-next-line
    const exp = exception as { message?: string; getResponse?: Function };

    this.logger.error({
      key: 'UNCAUGHT_EXCEPTION',
      data: {
        message: exp?.message,
      },
    });

    response.status(500).json({
      sucess: false,
      message: exp.message || 'something bad happend',
      data: exp.getResponse && exp.getResponse(),
    });
  }
}
