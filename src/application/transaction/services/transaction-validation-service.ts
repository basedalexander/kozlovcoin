import { Component, Inject } from '@nestjs/common';
import { ILogger, TLogger } from '../../../system/logger/interfaces/logger.interface';
import { Transaction } from '../classes/transaction';
import { UnspentTransactionOutput } from '../classes/unspent-transaction-output';
import { TransactionInput } from '../classes/transaction-input';
import { TransactionOutput } from '../classes/transaction-output';
import { TransactionUtilsService } from './transaction-utils.service';
import { CryptoService } from '../../crypto/crypto.service';
import { ICreateTransactionParams } from '../transaction-factory/create-transaction-params.interface';

@Component()
export class TransactionValidationService {
    constructor(
        @Inject(TLogger) private logger: ILogger,
        private txUtils: TransactionUtilsService,
        private crypto: CryptoService
    ) {

    }

    validateNew(tx: Transaction, uTxOuts: UnspentTransactionOutput[]): boolean {
        if (!this.validateTxStructure(tx)) {
            return false;
        }

        if (!this.validateId(tx)) {
            return false;
        }

        const inputsValid: boolean = this.validateTxInputs(tx, uTxOuts);
        if (!inputsValid) {
            this.logger.error(`Some of tx's inputs are not valid`);
            return false;
        }

        const amountValid: boolean = this.validateAmount(tx, uTxOuts);
        if (!amountValid) {
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

        const newTxInputsAreNew: boolean = newTx.inputs.every(txInput => {
            const txInputFound: boolean = !!allInputs.find(existingInput => {
                return (txInput.txOutputIndex === existingInput.txOutputIndex) && (txInput.txOutputId === existingInput.txOutputId);
            });

            return !txInputFound;
        });

        return newTxInputsAreNew;
    }

    validateTxInputs(tx: Transaction, uTxOuts: UnspentTransactionOutput[]): boolean {
        return tx.inputs.every(txInput => this.validateSingleTxInput(txInput, tx, uTxOuts));
    }

    validateSingleTxInput(txInput: TransactionInput, transaction: Transaction, uTxOuts: UnspentTransactionOutput[]): boolean {
        const referencedUTxOut: UnspentTransactionOutput =
            uTxOuts.find(uTxO => uTxO.txOutputId === txInput.txOutputId && uTxO.txOutputIndex === txInput.txOutputIndex);

        if (!referencedUTxOut) {
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
            this.logger.error(`Input signature is not valid`);
        }

        return true;
    }

    validateTxStructure(tx: Transaction): boolean {
        if (typeof tx.id !== 'string') {
            this.logger.error('transactionId missing');
            return false;
        }

        if (!(tx.inputs instanceof Array)) {
            this.logger.error('invalid txIns type in transaction');
            return false;
        }

        const inputsValid: boolean = tx.inputs.every(txInput => this.validateTxInputStructure(txInput));
        if (!inputsValid) {
            return false;
        }

        if (!(tx.outputs instanceof Array)) {
            this.logger.error('invalid txIns type in transaction');
            return false;
        }

        const outputsValid: boolean = tx.outputs.every(txOutput => this.validateTxOutputStructure(txOutput));
        if (!outputsValid) {
            return false;
        }

        return true;
    }

    validateTxInputStructure(txInput: TransactionInput): boolean {
        if (txInput == null) {
            this.logger.error('txInput is null');
            return false;
        } else if (typeof txInput.signature !== 'string') {
            this.logger.error('invalid signature type in txInput');
            return false;
        } else if (typeof txInput.txOutputId !== 'string') {
            this.logger.error('invalid txOutId type in txInput');
            return false;
        } else if (typeof  txInput.txOutputIndex !== 'number') {
            this.logger.error('invalid txOutIndex type in txInput');
            return false;
        } else {
            return true;
        }
    }

    validateTxOutputStructure(txOutput: TransactionOutput): boolean {
        if (txOutput == null) {
            this.logger.error('txOutput is null');
            return false;
        } else if (typeof txOutput.address !== 'string') {
            this.logger.error('invalid address type in txOutput');
            return false;
        } else if (!this.crypto.validatePublicKey(txOutput.address)) {
            this.logger.error('invalid TxOut address');
            return false;
        } else if (typeof txOutput.amount !== 'number') {
            this.logger.error('invalid amount type in txOutput');
            return false;
        } else {
            return true;
        }
    }

    validateId(tx: Transaction): boolean {
        const calculatedId: string = this.txUtils.calcTransactionId(tx);

        if (calculatedId !== tx.id) {
            this.logger.error(`Invalid tx id: ${tx.id}`);
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
}