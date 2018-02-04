import { Component, Inject } from '@nestjs/common';

import { Blockchain } from '../blockchain/blockchain';
import { EventEmitter } from '../../lib/event-emitter';
import { IBlock } from '../block/block.interface';
import { ILogger, TLogger } from '../../system/logger/interfaces/logger.interface';
import { Configuration } from '../../system/configuration';
import { TransactionPool } from '../transaction-pool/transaction-pool';
import { UnspentTransactionOutputs } from '../unspent-transaction-outputs/unspent-transaction-outputs';
import { TransactionFactory } from '../transaction/transaction-factory';
import { Transaction } from '../transaction/classes/transaction';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { BlockFactory } from '../block/block-factory';

@Component()
export class Node {
    public blockMined: EventEmitter = new EventEmitter();
    public newTransaction = new EventEmitter();
    public txPoolUpdate = new EventEmitter();

    private TRANSACTIONS_PER_BLOCK_LIMIT = 2;
    private BLOCK_GENERATION_INTERVAL = 10;
    private DIFFICULTY_ADJUSTMENT_INTERVAL = 10;
    private COINBASE_AMOUNT = 50;

    constructor(
        private config: Configuration,
        @Inject(TLogger) private logger: ILogger,

        private blockchain: Blockchain,
        private unspentTxOutputs: UnspentTransactionOutputs,
        private transactionPool: TransactionPool,

        private transactionFactory: TransactionFactory,
        private blockFactory: BlockFactory
    ) {

        this.blockMined = new EventEmitter();
        this.newTransaction = new EventEmitter();
        this.txPoolUpdate = new EventEmitter();

        this.init();
    }

    async addTx(newTx) {
        const uTxOutputs = await this.getUnspentTxOutputs();
        // const result = await this.transactionPool.addTx(newTx, uTxOutputs);
        const pool = await this.getTxPool();

        this.txPoolUpdate.emit(pool);
    }

    async getUnspentTxOutputs(): Promise<UnspentTransactionOutput[]> {
        return this.unspentTxOutputs.get();
    }

    async getTxPool(): Promise<Transaction[]> {
        return this.transactionPool.get();
    }

    async init() {
        if (!await this.blockchain.isStored()) {
            const genesisTx: Transaction = this.transactionFactory.createGenesis(this.config.creatorPublicAddress, this.COINBASE_AMOUNT);
            const genesisBlock = this.blockFactory.createGenesis(genesisTx);

            await this.blockchain.addBlock(genesisBlock);
        }

        if (!await this.unspentTxOutputs.isStored()) {
            const blocks: IBlock[] = await this.blockchain.get();
            await this.unspentTxOutputs.init(blocks);
        }
    }

    public async getBlocks(): Promise<IBlock[]> {
        return this.blockchain.get();
    }

    public async getLastBlock(): Promise<IBlock> {
        return this.blockchain.getLatestBlock();
    }
}