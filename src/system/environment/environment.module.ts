import { Module } from '@nestjs/common';
import { environment, Environment } from './environment';

@Module({
    components: [
        { provide: Environment, useValue: environment }
    ],
    exports: [
        Environment
    ]
})
export class EnvironmentModule {

}