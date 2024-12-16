import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle().pipe(
      catchError((error) => {
        console.log(error, 'error', error instanceof NotFoundException);
        if (error instanceof NotFoundException) {
          throw new NotFoundException(error.message);
        } else if (error instanceof ConflictException) {
          throw new ConflictException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
