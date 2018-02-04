import { Module } from '@nestjs/common';
import { UnspentTransactionOutputs } from './unspent-transaction-outputs';
import { StorageModule } from '../storage/storage.module';
import { UnspentTransactionOutputsUtilsService } from './unspent-transaction-outputs-utils.service';

@Module({
    imports: [
        StorageModule
    ],
    components: [
        UnspentTransactionOutputs,
        UnspentTransactionOutputsUtilsService
    ],
    exports: [
        UnspentTransactionOutputs
    ]
})
export class UnspentTransactionOutputsModule {

}