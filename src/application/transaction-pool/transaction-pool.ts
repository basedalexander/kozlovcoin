import { Component } from '@nestjs/common';

import { Transaction } from '../transaction/classes/transaction';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { TransactionValidationService } from '../transaction/services/transaction-validation-service';
import { UnspentTransactionOutputsUtilsService } from '../unspent-transaction-outputs/unspent-transaction-outputs-utils.service';

@Component()
export class TransactionPool {
    private transactions: Transaction[] = [];

    constructor(
        private txValidator: TransactionValidationService,
        private uTxOutsUtils: UnspentTransactionOutputsUtilsService
    ) {
    }

    public async addTransaction(tx: Transaction, uTxOuts: UnspentTransactionOutput[]): Promise<void> {
        const pool: Transaction[] = await this.get();
        const currentUTxOuts: UnspentTransactionOutput[] = this.uTxOutsUtils.updateUTxOutsWithNewTxs(uTxOuts, pool);

        const structureValid: boolean = this.txValidator.validateNew(tx, currentUTxOuts);

        if (!structureValid) {
            throw Error('ADD TO TX POOL ERROR: transaction is not valid');
        }

        const valid: boolean = this.txValidator.validateNewAgainstExistingTransactions(tx, pool);

        if (!valid) {
            throw Error('ADD TO TX POOL ERROR: transaction is not valid');
        }

        this.transactions.push(tx);
    }

    async get(): Promise<Transaction[]> {
        return this.transactions;
    }

    async clear(): Promise<void> {
        this.transactions = [];
    }
}