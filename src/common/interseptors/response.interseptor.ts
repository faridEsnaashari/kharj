import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) =>
        data?.count && data?.rows
          ? { rows: data.rows, paginationData: { total: data.count } }
          : data,
      ),
      map((data) => ({
        success: true,
        message: 'OPERATION_DONE',
        data: data || {},
      })),
    );
  }
}
