import { StagingLogger } from './logger/lib/staging-logger';
import { Module } from '@nestjs/common';
import { EnvironmentModule } from './environment/environment.module';
import { LoggerModule } from './logger/lib/logger.module';
import { Configuration } from './configuration';

@Module({
    modules: [
        EnvironmentModule,
        LoggerModule
    ],
    components: [
        Configuration
    ],
    exports: [
        EnvironmentModule,
        LoggerModule,
        Configuration
    ]
})
export class SystemModule {

}