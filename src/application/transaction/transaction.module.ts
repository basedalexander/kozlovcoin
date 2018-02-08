import { Module } from '@nestjs/common';
import { TransactionUtilsService } from './services/transaction-utils.service';
import { TransactionFactory } from './transaction-factory/transaction-factory';
import { CryptoModule } from '../crypto/crypto.module';
import { UnspentTransactionOutputsModule } from '../unspent-transaction-outputs/unspent-transaction-outputs.module';
import { TransactionValidationService } from './services/transaction-validation-service';

@Module({
    imports: [
        CryptoModule,
        UnspentTransactionOutputsModule
    ],
    components: [
        TransactionUtilsService,
        TransactionFactory,
        TransactionValidationService
    ],
    exports: [
        TransactionFactory,
        TransactionValidationService
    ]
})
export class TransactionModule {

}