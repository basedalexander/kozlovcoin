import { Component } from '@nestjs/common';

import { Transaction } from '../transaction/classes/transaction';

@Component()
export class TransactionPool {
    private transactions: Transaction[] = [];

    public async addTransaction(tx: Transaction): Promise<void> {
        this.transactions.push(tx);
    }

    async get(): Promise<Transaction[]> {
        return this.transactions;
    }
}