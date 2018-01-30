import { Injectable, Inject } from 'container-ioc';
import crypto from 'crypto';

import { Blockchain } from './blockchain/blockchain';
import { Block } from "./blockchain/block";
import { EventEmitter } from '../lib/event-emitter';
import { Configuration } from "../bootstrap/configuration";
import { hexToBinary } from "../lib/utils";
import {TxValidationService} from "./transaction/services/tx-validation.service";
import {TxUtilsService} from "./transaction/services/tx-utils.service";
import {TLogger} from "../system/logger/logger";
import {TransactionPool} from "./transaction/transaction-pool/transaction-pool";

@Injectable([
    Blockchain,
    TransactionPool,
    Configuration,
    TLogger,
    TxValidationService,
    TxUtilsService
])
export class Node {
    constructor(
        @Inject(Blockchain) blockchain,
        @Inject(TransactionPool) transactionPool,
        @Inject(Configuration) config,
        @Inject(TLogger) logger,
        @Inject(TxValidationService) txValidationService,
        @Inject(TxUtilsService) txUtilsService
    ) {
        this.TRANSACTIONS_PER_BLOCK_LIMIT = 2;
        this.BLOCK_GENERATION_INTERVAL = 10;
        this.DIFFICULTY_ADJUSTMENT_INTERVAL = 10;
        this.COINBASE_AMOUNT = 50;

        this._blockchain = blockchain;
        this._transactionPool = transactionPool;
        this._config = config.node;
        this._logger = logger;

        this._txValidationService = txValidationService;
        this._txUtilsService = txUtilsService;

        this._txs = [];              // todo refactor
        this._unspentTxOutputs = []; // todo refactor
        this._txPool = []; // todo refactor

        this.blockMined = new EventEmitter();
        this.newTransaction = new EventEmitter();
        this.txPoolUpdate = new EventEmitter();

        this.init();
    }

    async sendTransaction(receiverAddress, amount) {

    }

    async addTx(newTx) {
        const uTxOutputs = await this.getUnspentTxOutputs();
        const result = await this._transactionPool.addTx(newTx, uTxOutputs);
        const pool = await this.getTxPool();

        this.txPoolUpdate.emit(pool);
    }

    // todo prepared for refactoring
    async getUnspentTxOutputs() {
        return this._unspentTxOutputs;
    }

    async getTxPool() {
        return this.transactionPool.getTxPool();
    }

    init() {
        this._blockchain.addBlock(this._createGenesysBlock());
    }

    getBlocks() {
        return this._blockchain.getBlocks();
    }

    validateBlock(newBlock, previousBlock) {
        if (newBlock.index !== (previousBlock.index + 1)) {
            return false;
        }

        if (newBlock.previousBlockHash !== previousBlock.hash) {
            return false;
        }

        if (Block.createHash(newBlock) !== newBlock.hash) {
            return false;
        }

        return true;
    }

    addTransaction(tx) {
        this._txs.push(tx);

        if (this._txs.length === this.TRANSACTIONS_PER_BLOCK_LIMIT) {
            this.mine();
        }
    }

    clearTransactions() {
        this._txs = [];
    }

    mine() {
        const lastBlock = this._blockchain.getLatestBlock();

        this.addTransaction({
            from: 'network',
            to: this._config.minerAddress,
            amount: 1
        });

        const index = lastBlock.index + 1;
        const timeStamp = this._getCurrentTime();
        const data = { txs: this._txs };
        const previousHash = lastBlock.hash;
        const difficulty = this._getDifficulty(this._blockchain.getBlocks());

        const newBlock = this._findBlock(
            index,
            timeStamp,
            data,
            previousHash,
            this.difficulty
        );

        this._blockchain.addBlock(newBlock);
        this.clearTransactions();
        this.blockMined.emit(newBlock);

        return newBlock;
    }

    _findBlock(
        index,
        timeStamp,
        data,
        previousHash,
        difficulty
    ) {
        let nonce = 0;

        while (true) {
            const hash = this._calcHash(index, previousHash, timeStamp, data, difficulty, nonce);
            if (this._hashMatchesDifficulty(hash, difficulty)) {
                return new Block(index, timeStamp, data, previousHash, hash, difficulty, nonce);
            }
            nonce++;
        }
    }

    _getDifficulty(blockchain) {
        const latestBlock = blockchain[blockchain.length - 1];
        if (latestBlock.index % this.DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && latestBlock.index !== 0) {
            return this._getAdjustedDifficulty(latestBlock, blockchain);
        } else {
            return latestBlock.difficulty;
        }
    }

    _getAdjustedDifficulty(latestBlock, blockchain) {
        const prevAdjustmentBlock = blockchain[blockchain.length - this.DIFFICULTY_ADJUSTMENT_INTERVAL];
        const timeExpected = this.BLOCK_GENERATION_INTERVAL * this.DIFFICULTY_ADJUSTMENT_INTERVAL;
        const timeTaken = latestBlock.timeStamp - prevAdjustmentBlock.timeStamp;

        if (timeTaken < timeExpected / 2) {
            return prevAdjustmentBlock.difficulty + 1;
        } else if (timeTaken > timeExpected * 2) {
            return prevAdjustmentBlock.difficulty - 1;
        } else {
            return prevAdjustmentBlock.difficulty;
        }
    }
    
    _isValidTimeStamp(newBlock, previousBlock) {
        const currentTimeStamp = this._getCurrentTimestamp();
        return ( (previousBlock.timeStamp - 60) < newBlock.timeStamp) && 
               ( (newBlock.timeStamp - 60) < currentTimeStamp);
    }

    _createGenesysBlock() {
        const data = { txs: [] };
        return new Block(0, '0', data, '0', 0, 0);
    }

    _hashMatchesDifficulty(hash, difficulty) {
        const hashInBinary = hexToBinary(hash);
        const requiredPrefix = '0'.repeat(difficulty);
        return hashInBinary.startsWith(requiredPrefix);
    }

    _getCurrentTime() {
        return Math.round(Date.now() / 1000);
    }

    _calcHash(
        index,
        timeStamp,
        data,
        previousBlockHash,
        difficulty,
        nonce
    ) {
        data = JSON.stringify(data);

        const hash = crypto.createHash('sha256');

        return hash
            .update(`${index}`)
            .update(`${timeStamp}`)
            .update(`${data}`)
            .update(`${previousBlockHash}`)
            .update(`${difficulty}`)
            .update(`${nonce}`)
            .digest('hex');
    }

    _processTxs(txs, unspentTxOutputs, blockIndex) {
        if (!this._txValidationService.isValidTxStructure(txs)) {
            return null;
        }

        if (!this._txValidationService(txs, unspentTxOutputs, blockIndex)) {
            this._logger.log('invalid block transactions');
            return null;
        }
        return this._txUtilsService.updateUnspentTxOutputs(txs, unspentTxOutputs);
    }
}