import { Module } from '@nestjs/common';
import { NodeController } from '../api/controllers/node-controller/node.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { TransactionPoolModule } from '../transaction-pool/transaction-pool.module';
import { BlockModule } from '../block/block.module';
import { NodeManager } from './node-manager';
import { SystemModule } from '../../system/system.module';
import { UnspentTransactionOutputsModule } from '../unspent-transaction-outputs/unspent-transaction-outputs.module';
import { TransactionModule } from '../transaction/transaction.module';
import { P2P_PROVIDERS } from '../p2p-network/p2p-providers';
import { Node } from './node';

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
        NodeManager,
        ...P2P_PROVIDERS
    ],
    controllers: [
        NodeController
    ],
    exports: [
        NodeManager,
        Node,
        ...P2P_PROVIDERS
    ]
})
export class NodeModule {

}