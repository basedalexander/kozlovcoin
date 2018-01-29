import * as ecdsa from 'elliptic';
import * as _ from 'lodash'

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

    validateTx(tx, unspentTxOutputs) {

        if (this._txUtilsService.getTxId(tx) !== tx.id) {
            this._logError('invalid tx id: ' + tx.id);
            return false;
        }
        const hasValidTxInputs = tx.inputs
            .map((txInput) => this.validateTxInput(txInput, tx, unspentTxOutputs))
            .reduce((a, b) => a && b, true);

        if (!hasValidTxInputs) {
            this._logError('some of the txIns are invalid in tx: ' + tx.id);
            return false;
        }

        const totalTxInputValues = tx.inputs
            .map((txInput) => this._txUtilsService.getTxInputAmount(txInput, unspentTxOutputs))
            .reduce((a, b) => (a + b), 0);

        const totalTxOutputValues = tx.outputs
            .map((txOut) => txOut.amount)
            .reduce((a, b) => (a + b), 0);

        if (totalTxOutputValues !== totalTxInputValues) {
            this._logError('totalTxOutValues !== totalTxInValues in tx: ' + tx.id);
            return false;
        }

        return true;
    }

    // todo refactor
    validateBlockTransaction(aTransactions, aUnspentTxOuts, blockIndex) {
        const coinbaseTx = aTransactions[0];
        if (!this.validateCoinbaseTx(coinbaseTx, blockIndex)) {
            this._logError('invalid coinbase transaction: ' + JSON.stringify(coinbaseTx));
            return false;
        }

        //check for duplicate txIns. Each txIn can be included only once
        const txIns = _(aTransactions)
            .map(tx => tx.txIns)
            .flatten()
            .value();

        if (this._hasDuplicates(txIns)) {
            return false;
        }

        // all but coinbase transactions
        const normalTransactions = aTransactions.slice(1);
        return normalTransactions.map((tx) => this.validateTx(tx, aUnspentTxOuts))
            .reduce((a, b) => (a && b), true);
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

    validateTxStructure(tx) {
        if (typeof tx.id !== 'string') {
            this._logError('transactionId missing');
            return false;
        }
        if (!(tx.inputs instanceof Array)) {
            this._logError('invalid txIns type in transaction');
            return false;
        }
        if (!tx.inputs
                .map(this.validateTxOutputStructure)
                .reduce((a, b) => (a && b), true)) {
            return false;
        }

        if (!(tx.outputs instanceof Array)) {
            this._logError('invalid txIns type in transaction');
            return false;
        }

        if (!tx.outputs
                .map(this.validateTxOutputStructure)
                .reduce((a, b) => (a && b), true)) {
            return false;
        }
        return true;
    }

    validateTxInputStructure(txInput) {
        if (txInput == null) {
            this._logError('txIn is null');
            return false;
        } else if (typeof txInput.signature !== 'string') {
            this._logError('invalid signature type in txIn');
            return false;
        } else if (typeof txInput.txOutputId !== 'string') {
            this._logError('invalid txOutId type in txIn');
            return false;
        } else if (typeof  txInput.txOutputIndex !== 'number') {
            this._logError('invalid txOutIndex type in txIn');
            return false;
        } else {
            return true;
        }
    }

    validateTxOutputStructure(txOutput) {
        if (txOutput == null) {
            this._logError('txOut is null');
            return false;
        } else if (typeof txOutput.address !== 'string') {
            this._logError('invalid address type in txOut');
            return false;
        } else if (!this._isValidAddress(txOutput.address)) {
            this._logError('invalid TxOut address');
            return false;
        } else if (typeof txOutput.amount !== 'number') {
            this._logError('invalid amount type in txOut');
            return false;
        } else {
            return true;
        }
    }

    validateId(tx) {
        const txId = this._txUtilsService.getTxId(tx);

        if (tx.id !== txId) {
            this._logError(`invalid tx id: ${tx.id}`); // todo debug only
            return false;
        }

        return true;
    }

    // A valid address is a valid ecdsa public key in the 04 + X-coordinate + Y-coordinate format
    _isValidAddress(address) {
        if (address.length !== 130) {
            this._logError('invalid public key length');
            return false;
        } else if (address.match('^[a-fA-F0-9]+$') === null) {
            this._logError('public key must contain only hex characters');
            return false;
        } else if (!address.startsWith('04')) {
            this._logError('public key must start with 04');
            return false;
        }
        return true;
    }

    // todo get rid of lodash dependency
    _hasDuplicates(txIns) {
        const groups = _.countBy(txIns, (txIn) => txIn.txOutId + txIn.txOutId);
        return _(groups)
            .map((value, key) => {
                if (value > 1) {
                    this._logError('duplicate txIn: ' + key);
                    return true;
                } else {
                    return false;
                }
            })
            .includes(true);
    }

    // todo debug
    _logError(message) {
        this._logger.error(`TX VALIDATION ERROR: ${message}`);
    }
}