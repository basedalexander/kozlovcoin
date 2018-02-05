import { TransactionPool } from '../transaction-pool/transaction-pool';
import { Configuration } from '../../system/configuration';
import { Blockchain } from '../blockchain/blockchain';
import { Node } from './node';
import { TLogger } from '../../system/logger/interfaces/logger.interface';
import { UnspentTransactionOutputs } from '../unspent-transaction-outputs/unspent-transaction-outputs';
import { TransactionFactory } from '../transaction/transaction-factory/transaction-factory';
import { BlockFactory } from '../block/block-factory';

const injections = [
    Configuration,
    TLogger,
    Blockchain,
    UnspentTransactionOutputs,
    TransactionPool,
    TransactionFactory,
    BlockFactory
];

export const nodeProvider =         {
    provide: Node,
    useFactory: async (...args) => {
        // @ts-ignore
        const node = new Node(...args);

        await node.init();

        return node;
    },
    inject: injections
};