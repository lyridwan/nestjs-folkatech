import { CallHandler, ExecutionContext, HttpStatus, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((result) => ({
        statusCode: response.statusCode,
        statusMessage: HttpStatus[response.statusCode],
        message: result?.message ?? null,
        error: null,
        data: result?.data ?? result,
        meta: result?.meta ?? {},
      })),
    );
  }
}
