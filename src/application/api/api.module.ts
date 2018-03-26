import { Module } from '@nestjs/common';

import { ApiV1Module } from './v1/api.module';

@Module({
    imports: [
        ApiV1Module
    ]
})
export class ApiModule {

}