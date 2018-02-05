import { Module } from '@nestjs/common';
import { NodeController } from '../api/controllers/node.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { TransactionPoolModule } from '../transaction-pool/transaction-pool.module';
import { BlockModule } from '../block/block.module';
import { Node } from './node';
import { NodeManager } from './node-manager';
import { SystemModule } from '../../system/system.module';
import { UnspentTransactionOutputsModule } from '../unspent-transaction-outputs/unspent-transaction-outputs.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
    imports: [
        BlockchainModule,
        UnspentTransactionOutputsModule,
        TransactionModule,
        TransactionPoolModule,
        BlockModule,
        SystemModule
    ],
    components: [
        Node,
        NodeManager
    ],
    controllers: [
        NodeController
    ],
    exports: [
        NodeManager,
        Node
    ]
})
export class NodeModule {

}