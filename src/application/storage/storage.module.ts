import { Module } from '@nestjs/common';
import { InMemoryStorage } from './in-memory-storage';
import { FSStorage } from './fs-storage';
import { SystemModule } from '../../system/system.module';
import { storageProvider } from './storage-provider';

@Module({
    imports: [
        SystemModule
    ],
    components: [
        InMemoryStorage,
        FSStorage,
        storageProvider
    ],
    exports: [
        storageProvider
    ]
})
export class StorageModule {

}