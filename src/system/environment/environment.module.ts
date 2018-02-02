import { Module } from '@nestjs/common';
import { Environment } from './environment';

@Module({
    components: [
        Environment
    ],
    exports: [
        Environment
    ]
})
export class EnvironmentModule {

}