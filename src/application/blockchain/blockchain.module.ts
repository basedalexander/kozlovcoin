import { Module } from '@nestjs/common';

import { StorageModule } from '../storage/storage.module';
import { Blockchain } from './blockchain';
import { TStorage } from '../storage/storage.interface';
import { FSStorage } from '../storage/fs-storage';
import { InMemoryStorage } from '../storage/in-memory-storage';
import { Configuration } from '../../system/configuration';
import { SystemModule } from '../../system/system.module';

@Module({
    imports: [
        StorageModule,
        SystemModule
    ],
    components: [
        Blockchain,
        {
            provide: TStorage,
            useFactory: (config, memStorage, fsStorage) => {
                if (config.mode === 'test') {
                    return memStorage;
                } else {
                    return fsStorage;
                }
            },
            inject: [Configuration, InMemoryStorage, FSStorage]
        }
    ],
    exports: [
        Blockchain
    ]
})
export class BlockchainModule {

}