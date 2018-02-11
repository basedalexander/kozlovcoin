import { Module } from '@nestjs/common';
import { EnvironmentModule } from './environment/environment.module';
import { LoggerModule } from './logger/lib/logger.module';
import { Configuration } from './configuration';
import { SystemConstants } from './system-constants';

@Module({
    modules: [
        EnvironmentModule,
        LoggerModule
    ],
    components: [
        Configuration,
        SystemConstants
    ],
    exports: [
        EnvironmentModule,
        LoggerModule,
        Configuration,
        SystemConstants
    ]
})
export class SystemModule {

}