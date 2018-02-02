import { Module } from '@nestjs/common';

import { StagingLogger } from './staging-logger';
import { ConsoleLogger } from './console-logger';
import { LoggerMiddleware } from './logger.middleware';

@Module({
    components: [
        ConsoleLogger,
        StagingLogger,
        LoggerMiddleware
    ],
    exports: [
        ConsoleLogger,
        StagingLogger,
        LoggerMiddleware
    ]
})
export class LoggerModule {
}