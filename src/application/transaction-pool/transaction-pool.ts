import { Component } from '@nestjs/common';

import { Transaction } from '../transaction/classes/transaction';

@Component()
export class TransactionPool {
    async get(): Promise<Transaction[]> {
        return []; // todo
    }
}