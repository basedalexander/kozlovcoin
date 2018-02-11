import { Component, Inject } from '@nestjs/common';
import { ILogger, TLogger } from '../../../system/logger/interfaces/logger.interface';
import { Transaction } from '../classes/transaction';
import { UnspentTransactionOutput } from '../classes/unspent-transaction-output';
import { TransactionInput } from '../classes/transaction-input';
import { TransactionOutput } from '../classes/transaction-output';
import { TransactionUtilsService } from './transaction-utils.service';
import { CryptoService } from '../../crypto/crypto.service';
import { ICreateTransactionParams } from '../transaction-factory/create-transaction-params.interface';
import { SystemConstants } from '../../../system/system-constants';

@Component()
export class TransactionValidationService {
    constructor(
        @Inject(TLogger) private logger: ILogger,
        private txUtils: TransactionUtilsService,
        private crypto: CryptoService,
        private constants: SystemConstants
    ) {

    }

    validateCoinbase(tx: Transaction): boolean {
        if (!this.validateTxStructure(tx)) {
            return false;
        }

        if (tx.outputs[0].amount !== this.constants.COINBASE_AMOUNT) {
            this.logError(`coinbase output amount is not valid`, tx);
            return false;
        }

        return true;
    }

    validateNew(tx: Transaction, uTxOuts: UnspentTransactionOutput[]): boolean {
        if (!this.validateTxStructure(tx)) {
            return false;
        }

        if (!this.validateId(tx)) {
            return false;
        }

        if (!this.validateTxInputs(tx, uTxOuts)) {
            this.logError(`Some of tx's inputs are not valid`, tx);
            return false;
        }

        if (!this.validateAmount(tx, uTxOuts)) {
            return false;
        }

        return true;
    }

    validateNewAgainstExistingTransactions(newTx: Transaction, existingTransactions: Transaction[]): boolean {
        if (existingTransactions.length === 0) {
            return true;
        }

        const allInputs: TransactionInput[] = existingTransactions
                .map(tx => tx.inputs)
                .reduce((a, b) => a.concat(b), []);

        // checks if newTx inputs are not taken be some of the existing transactions
        const inputsNotTaken: boolean = newTx.inputs.every(txInput => {
            const txInputFound: boolean = !!allInputs.find(existingInput => {
                return (txInput.txOutputIndex === existingInput.txOutputIndex) && (txInput.txOutputId === existingInput.txOutputId);
            });

            return !txInputFound;
        });

        return inputsNotTaken;
    }

    validateTxInputs(tx: Transaction, uTxOuts: UnspentTransactionOutput[]): boolean {
        return tx.inputs.every(txInput => this.validateSingleTxInput(txInput, tx, uTxOuts));
    }

    validateSingleTxInput(txInput: TransactionInput, transaction: Transaction, uTxOuts: UnspentTransactionOutput[]): boolean {
        const referencedUTxOut: UnspentTransactionOutput =
            uTxOuts.find(uTxO => uTxO.txOutputId === txInput.txOutputId && uTxO.txOutputIndex === txInput.txOutputIndex);

        if (!referencedUTxOut) {
            this.logError(`referenced uTxOutput is not found for input ${JSON.stringify(txInput)}`, transaction);
            return false;
        }

        const validSignature: boolean = this.validateTxInputSignature(txInput, transaction, referencedUTxOut);

        if (!validSignature) {
            return false;
        }

        return true;
    }

    validateAmount(tx: Transaction, uTxOuts: UnspentTransactionOutput[]): boolean {
        const totalInputAmount: number = this.txUtils.getTotalInputAmount(tx, uTxOuts);
        const totalOutputAmount: number = this.txUtils.getTotalOutputAmount(tx);

        if (totalInputAmount !== totalOutputAmount) {
            this.logger.error(`Total imput amount does not match total output amount in transaction with id ${tx.id}`);
            return false;
        }

        return true;
    }

    validateTxInputSignature(txInput: TransactionInput, tx: Transaction, refUTxOutput: UnspentTransactionOutput): boolean {
        const valid: boolean = this.crypto.verifySignedMessage(tx.id, txInput.signature, refUTxOutput.address);

        if (!valid) {
            this.logError(`Input signature is not valid in input : ${JSON.stringify(txInput)}`, tx);
        }

        return true;
    }

    validateTxStructure(tx: Transaction): boolean {
        if (typeof tx.id !== 'string') {
            this.logError('transactionId missing', tx);
            return false;
        }

        if (!(tx.inputs instanceof Array)) {
            this.logError('invalid inputs', tx);
            return false;
        }

        const inputsValid: boolean = tx.inputs.every(txInput => this.validateTxInputStructure(txInput, tx));
        if (!inputsValid) {
            return false;
        }

        if (!(tx.outputs instanceof Array)) {
            this.logError('invalid outputs', tx);
            return false;
        }

        const outputsValid: boolean = tx.outputs.every(txOutput => this.validateTxOutputStructure(txOutput, tx));
        if (!outputsValid) {
            return false;
        }

        return true;
    }

    validateTxInputStructure(txInput: TransactionInput, tx: Transaction): boolean {
        if (txInput == null) {
            this.logError('txInput is null', tx);
            return false;
        } else if (typeof txInput.signature !== 'string') {
            this.logError('invalid signature type in txInput', tx);
            return false;
        } else if (typeof txInput.txOutputId !== 'string') {
            this.logError('invalid txOutId type in txInput', tx);
            return false;
        } else if (typeof  txInput.txOutputIndex !== 'number') {
            this.logError('invalid txOutIndex type in txInput', tx);
            return false;
        } else {
            return true;
        }
    }

    validateTxOutputStructure(txOutput: TransactionOutput, tx: Transaction): boolean {
        if (txOutput == null) {
            this.logError('txOutput is null', tx);
            return false;
        } else if (typeof txOutput.address !== 'string') {
            this.logError('invalid address type in txOutput', tx);
            return false;
        } else if (!this.crypto.validatePublicKey(txOutput.address)) {
            this.logError('invalid TxOut address', tx);
            return false;
        } else if (typeof txOutput.amount !== 'number') {
            this.logError('invalid amount type in txOutput', tx);
            return false;
        } else {
            return true;
        }
    }

    validateId(tx: Transaction): boolean {
        const calculatedId: string = this.txUtils.calcTransactionId(tx);

        if (calculatedId !== tx.id) {
            this.logError('Invalid id', tx);
            return false;
        }

        return true;
    }

    validateCreateParameters(params: ICreateTransactionParams): boolean {
        if (!params) {
            return false;
        }

        if (params.amount <= 0) {
            return false;
        }

        if (!this.crypto.validatePrivateKey(params.recipientPublicKey)) {
            return false;
        }

        if (!this.crypto.validateKeyPair(params.senderPrivateKey, params.senderPublicKey)) {
            return false;
        }

        return true;
    }

    private logError(message: string, tx?: Transaction): void {
        const txInfo: string = tx ? (`\n transaction => ${tx.id}`) : '';
        this.logger.error(`Transaction validation error: ${message} ${txInfo}`);
    }
}