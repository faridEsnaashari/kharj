import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from 'src/common/tools/pino/logger.tool';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger('HTTP_EXCEPTION');

  catch(exception: HttpException, host: ArgumentsHost): void {
    this.logger.error({ key: 'HTTP_EXCEPTION', data: exception });

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      sucess: false,
      message: exception.message || 'something bad happend',
      data: exception.getResponse(),
    });
  }
}
