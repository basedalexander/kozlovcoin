import { Component } from '@nestjs/common';
import { TransactionInput } from '../classes/transaction-input';
import { TransactionOutput } from '../classes/transaction-output';
import { Transaction } from '../classes/transaction';
import { TransactionUtilsService } from '../services/transaction-utils.service';
import { ICreateTransactionParams } from './create-transaction-params.interface';
import { UnspentTransactionOutput } from '../classes/unspent-transaction-output';
import { UnspentTransactionOutputsUtilsService } from '../../unspent-transaction-outputs/unspent-transaction-outputs-utils.service';

@Component()
export class TransactionFactory {
    constructor(
        private utils: TransactionUtilsService,
        private uTxOutsUtils: UnspentTransactionOutputsUtilsService
    ) {

    }

    public createCoinbase(publicAddress, coinbaseAmount): Transaction {
        const genesisInputTransaction = new TransactionInput('', 0, '');
        const genesisOutputTransaction = new TransactionOutput(publicAddress, coinbaseAmount);

        const tx = new Transaction('', [genesisInputTransaction], [genesisOutputTransaction]);

        tx.id = this.utils.calcTransactionId(tx);

        return tx;
    }

    public async create(params: ICreateTransactionParams): Promise<Transaction> {
        let senderUTxOuts: UnspentTransactionOutput[] = this.utils
            .getUTxOutsForAddress(params.senderPublicKey, params.uTxOuts);

        senderUTxOuts = this.uTxOutsUtils.updateUTxOutsWithNewTxs(senderUTxOuts, params.txPool);

        if (senderUTxOuts.length === 0) {
            throw new Error(`Error while creating a new transaction: Sender doesn't have any coins`);
        }

        const uTxOutsMatchingAmount = this.utils.searchUTxOutsForAmount(senderUTxOuts, params.amount);

        if (uTxOutsMatchingAmount.length === 0) {
            throw new Error(`Error while creating a new transaction: Sender doesn't have enough coins`);
        }

        const leftOverAmount: number = this.utils.getLeftOverAmount(uTxOutsMatchingAmount, params.amount);

        const inputs: TransactionInput[] = this.utils.uTxOutsToUnsignedTxInputs(uTxOutsMatchingAmount);

        const outputs: TransactionOutput[] = this.createTxOutsForNewTransaction(
            params.senderPublicKey,
            params.recipientPublicKey,
            params.amount,
            leftOverAmount
        );

        const newTransaction = new Transaction('', inputs, outputs);
        newTransaction.id = this.utils.calcTransactionId(newTransaction);

        const txValid: boolean = this.utils.validateTxInputs(newTransaction, params.senderPrivateKey, params.uTxOuts);
        if (!txValid) {
            throw new Error(`Create new transaction Error: Not valid`);
        }

        this.utils.signTxInputs(newTransaction, params.senderPrivateKey, params.uTxOuts);

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
}