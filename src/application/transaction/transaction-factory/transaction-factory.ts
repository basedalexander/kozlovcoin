import { Component, Inject } from '@nestjs/common';
import { TransactionInput } from '../classes/transaction-input';
import { TransactionOutput } from '../classes/transaction-output';
import { Transaction } from '../classes/transaction';
import { TransactionUtilsService } from '../services/transaction-utils.service';
import { ICreateTransactionParams } from './create-transaction-params.interface';
import { UnspentTransactionOutput } from '../classes/unspent-transaction-output';
import { UnspentTransactionOutputsUtilsService } from '../../unspent-transaction-outputs/unspent-transaction-outputs-utils.service';
import { TransactionValidationService } from '../services/transaction-validation-service';
import { ILogger, TLogger } from '../../../system/logger/interfaces/logger.interface';
import { SystemConstants } from '../../../system/system-constants';

@Component()
export class TransactionFactory {
    constructor(
        private utils: TransactionUtilsService,
        private uTxOutsUtils: UnspentTransactionOutputsUtilsService,
        private validator: TransactionValidationService,
        @Inject(TLogger) private logger: ILogger,
        private constants: SystemConstants
    ) {

    }

    public createCoinbase(publicAddress, blockIndex: number): Transaction {
        const genesisInputTransaction = new TransactionInput('', blockIndex, '');
        const genesisOutputTransaction = new TransactionOutput(publicAddress, this.constants.COINBASE_AMOUNT);

        const tx = new Transaction('', 0, [genesisInputTransaction], [genesisOutputTransaction]);

        tx.id = this.utils.calcTransactionId(tx);

        return tx;
    }

    public async create(params: ICreateTransactionParams): Promise<Transaction> {
        if (!this.validator.validateCreateParameters(params)) {
            this.throwException(`Provided transaction data is not valid`);
        }

        let senderUTxOuts: UnspentTransactionOutput[] = this.utils
            .getUTxOutsForAddress(params.senderPublicKey, params.uTxOuts);

        senderUTxOuts = this.uTxOutsUtils.updateUTxOutsWithNewTxs(senderUTxOuts, params.txPool); // todo the only usage of the foreighn module

        if (senderUTxOuts.length === 0) {
            this.throwException(`Sender doesn't have any coins`);
    }

        const uTxOutsMatchingAmount = this.utils.findUTxOutsForAmount(senderUTxOuts, params.amount);

        if (uTxOutsMatchingAmount.length === 0) {
            this.throwException(`Sender doesn't have any coins`);
        }

        const leftOverAmount: number = this.utils.getLeftOverAmount(uTxOutsMatchingAmount, params.amount);

        const inputs: TransactionInput[] = this.utils.convertUTxOutsToUnsignedTxInputs(uTxOutsMatchingAmount);

        const outputs: TransactionOutput[] = this.createTxOutsForNewTransaction(
            params.senderPublicKey,
            params.recipientPublicKey,
            params.amount,
            leftOverAmount
        );

        const timeStamp: number = this.utils.getCurrentTimeStamp();

        const newTransaction = new Transaction('', timeStamp, inputs, outputs);
        newTransaction.id = this.utils.calcTransactionId(newTransaction);

        this.utils.signTxInputs(newTransaction, params.senderPrivateKey, params.uTxOuts);

        const txValid: boolean = this.validator.validateTxInputs(newTransaction, senderUTxOuts);
        if (!txValid) {
            this.throwException(`Inputs are not valid in tx ${newTransaction.id}`);
        }

        return newTransaction;
    }

    private createTxOutsForNewTransaction(senderAddress: string, recipientAddress: string, amount: number, leftOverAmount): TransactionOutput[]  {
        const outputs = [];

        if (leftOverAmount > 0) {
            outputs.push(new TransactionOutput(senderAddress, leftOverAmount));
        }

        outputs.push(new TransactionOutput(recipientAddress, amount));

        return outputs;
    }

    private throwException(message: string): void {
        const msg: string = this.logError(message);
        throw new Error(msg);
    }

    private logError(message: string, extraInfo?: string): string {
        const extra: string = extraInfo ? (`\n ${extraInfo}`) : '';
        const msg: string = `Transaction factory error: ${message} ${extra}`;
        this.logger.error(msg);
        return msg;
    }
}