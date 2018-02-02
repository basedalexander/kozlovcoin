import { Module } from '@nestjs/common';

import { StagingLogger } from './staging-logger';
import { loggerProvider } from './logger-provider';
import { MockLogger } from './mock-logger';
import { EnvironmentModule } from '../../environment/environment.module';
import { ConsoleLogger } from './console-logger';

@Module({
    imports: [
        EnvironmentModule
    ],
    components: [
        ConsoleLogger,
        StagingLogger,
        MockLogger,
        loggerProvider
    ],
    exports: [
        loggerProvider
    ]
})
export class LoggerModule {
}