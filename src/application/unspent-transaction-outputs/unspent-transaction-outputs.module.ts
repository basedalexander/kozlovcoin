import { Module } from '@nestjs/common';
import { UnspentTransactionOutputs } from './unspent-transaction-outputs';
import { StorageModule } from '../storage/storage.module';
import { UnspentTransactionOutputsUtilsService } from './unspent-transaction-outputs-utils.service';
import { TStorage } from '../storage/storage.interface';
import { FSStorage } from '../storage/fs-storage';

@Module({
    imports: [
        StorageModule
    ],
    components: [
        UnspentTransactionOutputs,
        UnspentTransactionOutputsUtilsService,
        {
            provide: TStorage,
            useFactory: storage => storage,
            inject: [FSStorage]
        }
    ],
    exports: [
        UnspentTransactionOutputs,
        UnspentTransactionOutputsUtilsService
    ]
})
export class UnspentTransactionOutputsModule {

}