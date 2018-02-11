import { Module } from '@nestjs/common';
import { UnspentTransactionOutputs } from './unspent-transaction-outputs';
import { StorageModule } from '../storage/storage.module';
import { UnspentTransactionOutputsUtilsService } from './unspent-transaction-outputs-utils.service';
import { SystemModule } from '../../system/system.module';

@Module({
    imports: [
        StorageModule,
        SystemModule
    ],
    components: [
        UnspentTransactionOutputs,
        UnspentTransactionOutputsUtilsService
    ],
    exports: [
        UnspentTransactionOutputs,
        UnspentTransactionOutputsUtilsService
    ]
})
export class UnspentTransactionOutputsModule {

}