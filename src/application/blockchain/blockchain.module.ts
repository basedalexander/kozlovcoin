import { Module } from '@nestjs/common';

import { StorageModule } from '../storage/storage.module';
import { Blockchain } from './blockchain';
import { TStorage } from '../storage/storage.interface';
import { FSStorage } from '../storage/fs-storage';

@Module({
    imports: [
        StorageModule
    ],
    components: [
        Blockchain,
        {
            provide: TStorage,
            useFactory: storage => storage,
            inject: [FSStorage]
        }
    ],
    exports: [
        Blockchain
    ]
})
export class BlockchainModule {

}