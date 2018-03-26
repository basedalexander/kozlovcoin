import { ExceptionFilter, Catch, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception, response) {
        let status: number;
        let errorMessage: string;

        if (exception.getStatus) {
            status = exception.getStatus();
            const exceptionResponse =  <any> exception.getResponse();

            if (typeof exceptionResponse === 'object') {
               errorMessage = exceptionResponse.error;
            } else {
                errorMessage = exceptionResponse;
            }
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMessage = exception.message;
        }

        response
            .status(status)
            .json({
                error: errorMessage
            });
    }
}