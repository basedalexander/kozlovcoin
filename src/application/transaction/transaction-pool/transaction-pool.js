import { Injectable, Inject } from "container-ioc";
import {TLogger} from "../../../system/logger/logger";
import {TxValidationService} from "../services/tx-validation.service";
import * as _ from 'lodash'

@Injectable([
    TxValidationService,
    TLogger
])
export class TransactionPool {
    constructor(
        @Inject(TxValidationService) txValidationService,
        @Inject(TLogger) logger
    ) {
        this._txValidationService = txValidationService;
        this._logger = logger;

        this._pool = []; // todo store separately
    }

    async addTx(tx, uTxOutputs) {
        if (!await this._txValidationService.validateTx(tx, uTxOutputs)) {
            throw Error('Trying to add invalid tx to pool');
        }

        if (!await this._isTxValidForPool(tx)) {
            throw Error('Trying to add invalid tx to pool');
        }

        this._logger.log('adding to txPool: %s', JSON.stringify(tx));

        await this._addTxToPool(tx);
    }

    async _addTxToPool(tx) {
        this._pool.push(tx);
    }

    async getPool() {
        return this._pool;
    }

    async _isTxValidForPool(tx) {
        const pool = await this.getPool();

        const txPoolInputs = this._getTxPoolInputs(pool);

        const containsTxIn = (txIns, txIn) => {
            return _.find(txPoolInputs, (txPoolIn => {
                return (txIn.txOutIndex === txPoolIn.txOutIndex) &&
                       (txIn.txOutId === txPoolIn.txOutId);
            }));
        };

        for (const txIn of tx.inputs) {
            if (containsTxIn(txPoolInputs, txIn)) {
                this._logger.error('txIn already found in the txPool');
                return false;
            }
        }
        return true;
    }

    _getTxPoolInputs(txPool) {
        return _(txPool)
            .map((tx) => tx.inputs)
            .flatten()
            .value();
    }
}