import * as ecdsa from 'elliptic';

import { Injectable, Inject } from 'container-ioc';
import { TxUtilsService } from "./tx-utils.service";

@Injectable([TxUtilsService])
export class TxValidationService {
    constructor(
        @Inject(TxUtilsService) txUtilsService,
        @Inject(TLogger) logger,
    ) {
        this._txUtilsService = txUtilsService;
        this._logger = logger;
    }

    validateCoinbaseTx(tx, blockIndex, coinbaseAmount) {
        if (this._txUtilsService.getTxId(tx) !== tx.id) {
            this._logError('invalid coinbase tx id: ' + tx.id);
            return false;
        }
        if (tx.inputs.length !== 1) {
            this._logError('one txIn must be specified in the coinbase transaction');
            return;
        }
        if (tx.inputs[0].txOutIndex !== blockIndex) {
            this._logError('the txIn index in coinbase tx must be the block height');
            return false;
        }
        if (tx.outputs.length !== 1) {
            this._logError('invalid number of txOuts in coinbase transaction');
            return false;
        }
        if (tx.outputs[0].amount !== coinbaseAmount) {
            this._logError('invalid coinbase amount in coinbase transaction');
            return false;
        }
        return true;
    }

    validateStructure(tx) {
        if (typeof tx.id !== 'string') {
            this._logError(`tx id is missing`); // todo debug only
            return false;
        }

        if (!(tx.inputs instanceof Array)) {
            this._logError(`tx inputs are missing`); // todo debug only
            return false;
        }

        if (!(tx.outputs instanceof Array)) {
            this._logError(`tx outputs are missing`); // todo debug only
            return false;
        }

        return true;
    }

    validateId(tx) {
        const txId = this._txUtilsService.getTxId(tx);

        if (tx.id !== txId) {
            this._logError(`invalid tx id: ${tx.id}`); // todo debug only
            return false;
        }

        return true;
    }

    validateTxInput(txInput, tx, uTxOutputs) {
        const referencedUnspentTxOutput = uTxOutputs.find((uTxOutput) => {
            return (uTxOutput.txOutputId === txInput.txOutputId &&
                    uTxOutput.txOutputId === txInput.txOutputId);
        });

        if (referencedUnspentTxOutput == null) {
            this._logError(`referenced txOut not found: ${JSON.stringify(txInput)}`); // todo debug only
            return false;
        }

        const address = referencedUnspentTxOutput.address;

        const ec = new ecdsa.ec('secp256k1');

        const key = ec.keyFromPublic(address, 'hex');

        return key.verify(tx.id, txInput.signature);
    }

    validateTxOutputValues(tx, uTxOutputs) {
        const totalTxInValues = tx.inputs
            .map((txIn) => this._txUtilsService.getTxInputAmount(txIn, uTxOutputs))
            .reduce((a, b) => (a + b), 0);

        const totalTxOutValues = tx.outputs
            .map((txOut) => txOut.amount)
            .reduce((a, b) => (a + b), 0);

        if (totalTxOutValues !== totalTxInValues) {
            this._logError(`totalTxOutValues !== totalTxInValues in tx: ${tx.id}`); // todo debug only
            return false;
        }
    }

    // todo debug
    _logError(message) {
        this._logger.error(`TX VALIDATION ERROR: ${message}`);
    }
}