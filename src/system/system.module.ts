import { StagingLogger } from './logger/lib/staging-logger';
import { Module } from '@nestjs/common';
import { EnvironmentModule } from './environment/environment.module';
import { Environment } from './environment/environment';
import { LoggerModule } from './logger/lib/logger.module';
import { TLogger } from './logger/interfaces/logger.interface';
import { ConsoleLogger } from './logger/lib/console-logger';
import { MockLogger } from './logger/lib/mock-logger';

@Module({
    modules: [
        EnvironmentModule,
        LoggerModule
    ],
    components: [
        {
            provide: TLogger,
            useFactory: async (env, consoleLogger, stagingLogger) => {
                if (env.mode === 'local') {
                    return consoleLogger;
                } else if (env.mode === 'test') {
                    return new MockLogger();
                } else {
                    return stagingLogger;
                }
            },
            inject: [Environment, ConsoleLogger, StagingLogger]
        }
    ],
    exports: [
        EnvironmentModule,
        LoggerModule
    ]
})
export class SystemModule {

}