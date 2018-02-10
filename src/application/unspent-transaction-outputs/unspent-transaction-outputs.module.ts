import { Module } from '@nestjs/common';
import { UnspentTransactionOutputs } from './unspent-transaction-outputs';
import { StorageModule } from '../storage/storage.module';
import { UnspentTransactionOutputsUtilsService } from './unspent-transaction-outputs-utils.service';
import { TStorage } from '../storage/storage.interface';
import { FSStorage } from '../storage/fs-storage';
import { InMemoryStorage } from '../storage/in-memory-storage';
import { Environment } from '../../system/environment/environment';
import { Configuration } from '../../system/configuration';
import { SystemModule } from '../../system/system.module';

@Module({
    imports: [
        StorageModule,
        SystemModule
    ],
    components: [
        UnspentTransactionOutputs,
        UnspentTransactionOutputsUtilsService,
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
        UnspentTransactionOutputs,
        UnspentTransactionOutputsUtilsService
    ]
})
export class UnspentTransactionOutputsModule {

}