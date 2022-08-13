import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppLogger } from '../logger/logger.service';
import { createRequestContext } from '../request-context/util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private appLogger: AppLogger) {
    this.appLogger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const ctx = createRequestContext(request);

    return next.handle().pipe(
      tap(() => {
        const responseTime = `${Date.now() - now}ms`;
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        const resData = { method, statusCode, responseTime };

        this.appLogger.log(ctx, 'Request completed', { resData });
      }),
    );
  }
}
