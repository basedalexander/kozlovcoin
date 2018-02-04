import { Module } from '@nestjs/common';

import { StorageModule } from '../storage/storage.module';
import { InMemoryStorage } from '../storage/in-memory-storage';
import { Blockchain } from './blockchain';
import { TStorage } from '../storage/storage.interface';

@Module({
    imports: [
        StorageModule
    ],
    components: [
        Blockchain,
        {
            provide: TStorage,
            useFactory: storage => storage,
            inject: [InMemoryStorage]
        }
    ],
    exports: [
        Blockchain
    ]
})
export class BlockchainModule {

}