import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, UnprocessableEntityException } from '@nestjs/common';

@Catch(UnprocessableEntityException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      status: status,
      message: exceptionResponse['error']['message'] || exception.message,
      error: exceptionResponse['error']
    });

  }
}
