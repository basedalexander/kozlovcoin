import { Module } from '@nestjs/common';
import { TransactionUtilsService } from './services/transaction-utils.service';
import { TransactionFactory } from './transaction-factory';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
    imports: [
        CryptoModule
    ],
    components: [
        TransactionUtilsService,
        TransactionFactory
    ],
    exports: [
        TransactionFactory
    ]
})
export class TransactionModule {

}