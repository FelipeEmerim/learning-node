import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from '../exceptions/entity-not-found.exception';

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter {
  // eslint-disable-next-line class-methods-use-this
  catch(exception: EntityNotFoundError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      error: 'Not Found',
      message: 'Resource not found',
    });
  }
}
