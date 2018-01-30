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
import {UnspentTxOutput} from "./transaction/classes/unspent-tx-output";

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

        this.blockMined = new EventEmitter();
        this.newTransaction = new EventEmitter();
        this.txPoolUpdate = new EventEmitter();

        this.init();
    }

    async addTx(newTx) {
        const uTxOutputs = await this.getUnspentTxOutputs();
        const result = await this._transactionPool.addTx(newTx, uTxOutputs);
        const pool = await this.getTxPool();

        this.txPoolUpdate.emit(pool);
    }

    async getUnspentTxOutputs() {
        return this._unspentTxOutputs;
    }

    async getTxPool() {
        return this._transactionPool.getPool();
    }

    getStatus() {
        return {
            todo: true
        }
    }

    async init() {
        const genesisBlock = this._createGenesisBlock();

        await this._blockchain.addBlock(genesisBlock);

        this._unspentTxOutputs = this._processTransactions(genesisBlock.data, [], genesisBlock.index);
    }

    async getBlocks() {
        return this._blockchain.getBlocks();
    }

    async getLastBlock() {
        return this._blockchain.getLatestBlock();
    }

    // todo move away
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

    async generateNewBlock() {
        const coinbaseTx = this._txUtilsService.createCoinbaseTransaction()
    }

    async mine() {
        const lastBlock = await this._blockchain.getLatestBlock();

        this.addTransaction({
            from: 'network',
            to: this._config.minerAddress,
            amount: 1
        });

        const index = lastBlock.index + 1;
        const timeStamp = this._getCurrentTime();
        const data = { txs: this._txs };
        const previousHash = lastBlock.hash;
        const difficulty = this._getDifficulty(await this._blockchain.getBlocks());

        const newBlock = this._findBlock(
            index,
            timeStamp,
            data,
            previousHash,
            this.difficulty
        );

        await this._blockchain.addBlock(newBlock);
        this.clearTransactions();
        this.blockMined.emit(newBlock);

        return newBlock;
    }

    // todo = mine
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

    _createGenesisBlock() {
        const genesisTx = this._createGenesisTx(this._config.minerAddress, this._config.initialCoinAllocationAmount);

        const index = 0;
        const timeStamp = 1465154705;
        const data = [genesisTx];
        const previousHash = '';

        const difficulty = 0;
        const nonce = 0;

        const hash = this._calcHash(
            index,
            timeStamp,
            data,
            previousHash,
            difficulty,
            nonce
        );

        return new Block(
            index,
            timeStamp,
            data,
            previousHash,
            hash,
            difficulty,
            nonce
        );
    }

    _createGenesisTx(publicAddress, initialCoinAllocationAmount) {
        const tx = {
            inputs: [
                {
                    signature: '',
                    txOutputId: '',
                    txOutputIndex: 0
                }
            ],
            outputs: [
                {
                    address: publicAddress,
                    amount: this.COINBASE_AMOUNT
                }
            ]
        };

        tx.id = this._txUtilsService.getTxId(tx);

        return tx;
    }

    _isValidTimeStamp(newBlock, previousBlock) {
        const currentTimeStamp = this._getCurrentTimestamp();
        return ( (previousBlock.timeStamp - 60) < newBlock.timeStamp) && 
               ( (newBlock.timeStamp - 60) < currentTimeStamp);
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

    // todo move out of the class
    _processTransactions(txs, unspentTxOutputs, blockIndex) {
        if (!this._txValidationService.validateBlockTransactions(txs, unspentTxOutputs, blockIndex, this.COINBASE_AMOUNT)) {
            this._logger.log('invalid block transactions');
            return null;
        }
        return this._updateUnspentTransactionOutputs(txs, unspentTxOutputs);
    }

    _updateUnspentTransactionOutputs(aTransactions, aUnspentTxOuts) {
        const newUnspentTxOuts = aTransactions
        .map((t) => {
            return t.outputs.map((txOut, index) => new UnspentTxOutput(t.id, index, txOut.address, txOut.amount));
        })
        .reduce((a, b) => a.concat(b), []);

        const consumedTxOuts = aTransactions
        .map((t) => t.inputs)
        .reduce((a, b) => a.concat(b), [])
        .map((txIn) => new UnspentTxOutput(txIn.txOutputId, txIn.txOutputIndex, '', 0));

        const resultingUnspentTxOuts = aUnspentTxOuts
        .filter(((uTxO) => !this._findUnspentTxOut(uTxO.txOutputId, uTxO.txOutputIndex, consumedTxOuts)))
        .concat(newUnspentTxOuts);

        return resultingUnspentTxOuts;
    }

    _findUnspentTxOut(transactionId, index, aUnspentTxOuts) {
        return aUnspentTxOuts.find((uTxO) => uTxO.txOutputId === transactionId && uTxO.txOutputIndex === index);
    }
}