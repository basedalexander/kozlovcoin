import { Module } from '@nestjs/common';
import { TransactionPool } from './transaction-pool';

@Module({
    components: [
       TransactionPool
    ],
    exports: [
        TransactionPool
    ]
})
export class TransactionPoolModule {

}