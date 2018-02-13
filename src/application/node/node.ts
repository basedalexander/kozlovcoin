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
import { SystemConstants } from '../../system/system-constants';
import { BlockValidatorService } from '../block/block-validator.service';
import { Scheduler } from './scheduler';

@Component()
export class Node {
    public blockMined: EventEmitter<IBlock> = new EventEmitter();
    public txPoolUpdate: EventEmitter<Transaction[]> = new EventEmitter();

    constructor(
        private config: Configuration,
        private constants: SystemConstants,

        private blockchain: Blockchain,
        private unspentTxOutputs: UnspentTransactionOutputs,
        private transactionPool: TransactionPool,

        private blockFactory: BlockFactory,
        private transactionFactory: TransactionFactory,
        private miningHelper: MiningHelpersService,

        private blockValidator: BlockValidatorService,
        @Inject(TLogger) private logger: ILogger,
        private scheduler: Scheduler
    ) {

    }

    async addTransaction(tx: Transaction): Promise<void> {
        const uTxOutputs = await this.getUnspentTxOutputs();
        const result = await this.transactionPool.addTransaction(tx, uTxOutputs);

        const pool = await this.getTxPool();
        this.txPoolUpdate.emit(pool);
    }

    async addNewBlock(block: IBlock): Promise<void> {
        await this.blockchain.addBlock(block);
        this.resetAutomining();
    }

    // TODO move parameter initializations on factory side
    async mineNewBlock(): Promise<IBlock> {
        const lastBlock: IBlock = await this.blockchain.getLastBlock();
        const nextBlockIndex: number = lastBlock.index + 1;
        const coinbaseTx: Transaction = this.transactionFactory.createCoinbase(this.config.minerPublicKey, nextBlockIndex);

        const txPool: Transaction[] = await this.getTxPool();
        const blockData: Transaction[] = [coinbaseTx].concat(txPool);
        const blockchain: IBlock[] = await this.getBlocks();

        const newBlock = this.blockFactory.createNew(
            blockData,
            blockchain,
            this.constants.BLOCK_GENERATION_INTERVAL,
            this.constants.DIFFICULTY_ADJUSTMENT_INTERVAL
        );

        await this.blockchain.addBlock(newBlock);

        await this.unspentTxOutputs.update(newBlock);
        await this.transactionPool.clear();

        this.blockMined.emit(newBlock);

        this.resetAutomining();

        return newBlock;
    }

    async handleRecievedChain(chain: IBlock[]): Promise<void> {
        this.logger.info(`Handling received chain ...`);

        if (!this.blockValidator.validateChain(chain)) {
            this.logger.error(`Received chain is not valid, ignoring`);
            return;
        }

        const ourLastBlock: IBlock = await this.getLastBlock();

        if (chain[chain.length - 1].index > ourLastBlock.index) {
            this.logger.info(`Received chain that is valid and longer that existing chain, replacing`);
            await this.blockchain.set(chain);
        }
    }

    async getUnspentTxOutputs(): Promise<UnspentTransactionOutput[]> {
        return this.unspentTxOutputs.get();
    }

    async getTxPool(): Promise<Transaction[]> {
        return this.transactionPool.get();
    }

    async init() {
        if (!await this.blockchain.isStored()) {
            const genesisTx: Transaction = this.transactionFactory.createCoinbase(this.config.genesisPublicKey, 0);
            const genesisBlock = this.blockFactory.createGenesis(genesisTx);

            await this.blockchain.addBlock(genesisBlock);
        }

        if (!await this.unspentTxOutputs.isStored()) {
            const blocks: IBlock[] = await this.blockchain.get();
            await this.unspentTxOutputs.init(blocks);
        }

        this.initAutomining();
    }

    async destroy(): Promise<void> {
        this.stopAutomining();
    }

    public initAutomining(): void {
        // this.scheduler.subscribe(() => {
        //    this.actOnSchedule();
        // });

        this.scheduler.start();
    }

    public resetAutomining(): void {
        this.scheduler.reset();
    }

    public stopAutomining(): void {
        this.scheduler.kill();
    }

    public async getBlocks(): Promise<IBlock[]> {
        return this.blockchain.get();
    }

    public async getLastBlock(): Promise<IBlock> {
        return this.blockchain.getLastBlock();
    }

    private async actOnSchedule(): Promise<void> {
        const txPool: Transaction[] = await this.getTxPool();

        if (txPool.length) {
            await this.mineNewBlock();
        }
    }
}