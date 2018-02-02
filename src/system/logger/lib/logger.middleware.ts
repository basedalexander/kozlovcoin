import { Inject, Middleware } from '@nestjs/common';
import { ExpressMiddleware, NestMiddleware } from '@nestjs/common/interfaces/middlewares';
import { ILogger, TLogger } from '../interfaces/logger.interface';

@Middleware()
export class LoggerMiddleware implements NestMiddleware {
    constructor(@Inject(TLogger) private logger: ILogger) {
    }

    resolve(...args: any[]): ExpressMiddleware {
        return (req, res, next) => {
            this.logger.info(`${req.method} ${req.originalUrl}`);
            next();
        };
    }
}