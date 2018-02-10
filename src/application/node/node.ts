import { Component, Inject } from '@nestjs/common';

import { Blockchain } from '../blockchain/blockchain';
import { EventEmitter } from '../../lib/event-emitter';
import { IBlock } from '../block/block.interface';
import { ILogger, TLogger } from '../../system/logger/interfaces/logger.interface';
import { Configuration } from '../../system/configuration';
import { TransactionPool } from '../transaction-pool/transaction-pool';
import { UnspentTransactionOutputs } from '../unspent-transaction-outputs/unspent-transaction-outputs';
import { TransactionFactory } from '../transaction/transaction-factory/transaction-factory';
import { Transaction } from '../transaction/classes/transaction';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { BlockFactory } from '../block/block-factory';
import { MiningHelpersService } from './mining-helpers.service';

@Component()
export class Node {
    public blockMined: EventEmitter = new EventEmitter();
    public newTransaction = new EventEmitter();
    public txPoolUpdate = new EventEmitter();

    private BLOCK_GENERATION_INTERVAL = 10;
    private DIFFICULTY_ADJUSTMENT_INTERVAL = 10;
    private COINBASE_AMOUNT = 50;

    constructor(private config: Configuration,
                @Inject(TLogger) private logger: ILogger,
                private blockchain: Blockchain,
                private unspentTxOutputs: UnspentTransactionOutputs,
                private transactionPool: TransactionPool,
                private transactionFactory: TransactionFactory,
                private blockFactory: BlockFactory,
                private miningHelper: MiningHelpersService
    ) {

        this.blockMined = new EventEmitter();
        this.newTransaction = new EventEmitter();
        this.txPoolUpdate = new EventEmitter();
    }

    async addTransaction(tx: Transaction): Promise<void> {
        const uTxOutputs = await this.getUnspentTxOutputs();
        const result = await this.transactionPool.addTransaction(tx, uTxOutputs);

        const pool = await this.getTxPool();
        this.txPoolUpdate.emit(pool);
    }

    async mineNewBlock(): Promise<IBlock> {
        const lastBlock: IBlock = await this.blockchain.getLatestBlock();
        const nextBlockIndex: number = lastBlock.index + 1;
        const coinbaseTx: Transaction = this.transactionFactory.createCoinbase(this.config.creatorPublicAddress, this.COINBASE_AMOUNT, nextBlockIndex);

        const txPool: Transaction[] = await this.getTxPool();
        const blockData: Transaction[] = [coinbaseTx].concat(txPool);
        const blockchain: IBlock[] = await this.getBlocks();

        const newBlock = this.blockFactory.createNew(
            blockData,
            blockchain,
            this.BLOCK_GENERATION_INTERVAL,
            this.DIFFICULTY_ADJUSTMENT_INTERVAL
        );

        await this.blockchain.addBlock(newBlock);

        await this.unspentTxOutputs.update(newBlock);
        await this.transactionPool.clear();

        this.blockMined.emit(newBlock);

        return newBlock;
    }

    async getUnspentTxOutputs(): Promise<UnspentTransactionOutput[]> {
        return this.unspentTxOutputs.get();
    }

    async getTxPool(): Promise<Transaction[]> {
        return this.transactionPool.get();
    }

    async init() {
        if (!await this.blockchain.isStored()) {
            const genesisTx: Transaction = this.transactionFactory.createCoinbase(this.config.creatorPublicAddress, this.COINBASE_AMOUNT, 0);
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