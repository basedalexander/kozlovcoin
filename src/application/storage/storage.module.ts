import { Module } from '@nestjs/common';
import { InMemoryStorage } from './in-memory-storage';
import { FSStorage } from './fs-storage';
import { SystemModule } from '../../system/system.module';

@Module({
    imports: [
        SystemModule
    ],
    components: [
        InMemoryStorage,
        FSStorage
    ],
    exports: [
        InMemoryStorage,
        FSStorage
    ]
})
export class StorageModule {

}