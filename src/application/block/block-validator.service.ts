import { Component, Inject } from '@nestjs/common';
import { IBlock } from './block.interface';
import { ILogger, TLogger } from '../../system/logger/interfaces/logger.interface';
import { BlockFactory } from './block-factory';
import { TransactionFactory } from '../transaction/transaction-factory/transaction-factory';
import { Transaction } from '../transaction/classes/transaction';
import { Configuration } from '../../system/configuration';
import { BlockUtilsService } from './block-utils.service';
import { TransactionValidationService } from '../transaction/services/transaction-validation-service';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { UnspentTransactionOutputsUtilsService } from '../unspent-transaction-outputs/unspent-transaction-outputs-utils.service';

@Component()
export class BlockValidatorService {
    constructor(
        @Inject(TLogger) private logger: ILogger,
        private blockFactory: BlockFactory,
        private txFactory: TransactionFactory,
        private config: Configuration,
        private utils: BlockUtilsService,
        private txValidator: TransactionValidationService,
        private uTxOutsUtils: UnspentTransactionOutputsUtilsService
    ) {

    }
    public validateStructure(block: IBlock): boolean {
        return typeof block.index === 'number'
            && typeof block.timeStamp === 'number'
            && typeof block.data === 'object'
            && typeof block.previousBlockHash === 'string'
            && typeof block.hash === 'string'
            && typeof block.difficulty === 'number'
            && typeof block.nonce === 'number';
    }

    public validateGenesisBlock(block: IBlock): boolean {
        if (!this.validateStructure(block)) {
            this.logger.error(`Block validation error: block with hash ${block.hash} has invalid structure`);
            return false;
        }

        const coinbaseTx: Transaction = this.txFactory.createCoinbase(this.config.genesisPublicKey, 0);
        const realGenesisBlock: IBlock = this.blockFactory.createGenesis(coinbaseTx);

        const serializedRealGenesisBlock: string = JSON.stringify(realGenesisBlock);
        const serializedBlock: string = JSON.stringify(block);
        if (serializedBlock !== serializedRealGenesisBlock) {
            return false;
        }

        return true;
    }

    public validateChain(chain: IBlock[]): boolean {
        if (!chain || !(chain.length > 1)) {
            return false;
        }

        if (!this.validateGenesisBlock(chain[0])) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const valid: boolean = this.validateNewBlock(chain[i], chain);

            if (!valid) {
                return false;
            }
        }

        return true;
    }

    public validateNewBlock(block: IBlock, blockchain: IBlock[]): boolean {
        if (!this.validateStructure(block)) {
            return false;
        }

        if (!this.validateNewBlockIndex(block, blockchain)) {
            return false;
        }

        if (!this.validateNewBlockPrevHash(block, blockchain)) {
            return false;
        }

        if (!this.validateTimeStamp(block, blockchain)) {
            return false;
        }

        if (!this.validateBlockTransactions(block, blockchain)) {
            return false;
        }

        if (!this.validateHash(block, blockchain)) {
            return false;
        }

        return true;
    }

    public validateNewBlockIndex(block: IBlock, blockchain: IBlock[]): boolean {
        const prevBlock: IBlock = blockchain[blockchain.length - 1];

        if (block.index !== (prevBlock.index + 1)) {
            this.logError('index is not valid', block);
            return false;
        }

        return true;
    }

    public validateNewBlockPrevHash(block: IBlock, blockchain: IBlock[]): boolean {
        const prevBlock: IBlock = blockchain[blockchain.length - 1];

        if (block.previousBlockHash !== prevBlock.hash) {
            this.logError('previous hash is not valid', block);
            return false;
        }

        return true;
    }

    public validateTimeStamp(block: IBlock, blockchain: IBlock[]): boolean {
        const prevBlock: IBlock = blockchain[blockchain.length - 1];

        // todo validate interval span
        if (!(block.timeStamp > prevBlock.timeStamp)) {
            this.logError('time stamp is not valid', block);
            return false;
        }

        return true;
    }

    public validateBlockTransactions(block: IBlock, blockchain: IBlock[]): boolean {
        const blockTransactions: Transaction[] = block.data;

        if (blockTransactions.length < 2) {
            this.logError(`amount of transactions in block is too small`, block);
            return false;
        }

        if (!this.txValidator.validateCoinbase(blockTransactions[0])) {
            return;
        }

        const existingTransactions: Transaction[] = this.utils.retrieveTransactionsFromBlocks(blockchain);

        for (let i = 1; i < blockTransactions.length; i++) {
            const prevTx: Transaction = blockTransactions[i - 1];
            existingTransactions.push(prevTx);

            const txToValidate = blockTransactions[i];
            const uTxOuts: UnspentTransactionOutput[] = this.uTxOutsUtils.convertTxsToUnspentTxOuts(existingTransactions);
            const valid: boolean = this.txValidator.validateNew(txToValidate, uTxOuts);

            if (!valid) {
                return false;
            }
        }

        return true;
    }

    public validateHash(block: IBlock, blockchain: IBlock[]): boolean {

        const hash: string = this.utils.calcHashForBlock(block);

        if (hash !== block.hash) {
            this.logError('hash is not valid', block);
            return false;
        }

        if (!this.utils.checkHashMatchesDifficulty(block.hash, block.difficulty)) {
            this.logError('hash does not match difficulty', block);
            return false;
        }
        return true;
    }

    private logError(message: string, block: IBlock): void {
        const blockInfo: string = block ? (`\n block hash: ${block.hash}`) : '';
        this.logger.error(`New block validation error: ${message} ${blockInfo}`);
    }
}