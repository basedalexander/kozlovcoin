import { Component, Inject } from '@nestjs/common';

import { IBlock } from '../block/block.interface';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { Transaction } from '../transaction/classes/transaction';
import { UnspentTransactionOutputsUtilsService } from './unspent-transaction-outputs-utils.service';
import { IStorage, TStorage } from '../storage/storage.interface';

@Component()
export class UnspentTransactionOutputs {
    private FILE_NAME: string = 'utxoutputs.json';

    constructor(
        @Inject(TStorage) private storage: IStorage,
        private utils: UnspentTransactionOutputsUtilsService
    ) {}

    async get(): Promise<UnspentTransactionOutput[]> {
        return this.load();
    }

    async isStored(): Promise<boolean> {
        const data = await this.get();

        if (data && data.length) {
            return true;
        } else {
            return false;
        }
    }

    async init(blocks: IBlock[]): Promise<void> {
        let uTxOuts: UnspentTransactionOutput[] = [];

        blocks.forEach(block => {
            uTxOuts = this.utils.updateUTxOutsWithNewTxs(uTxOuts, block.data);
        });

        await this.save(uTxOuts);
    }

    private async update(newTransactions: Transaction[]): Promise<void> {
        const uTxOuts: UnspentTransactionOutput[] = await this.get();

        const updatedUTxOuts: UnspentTransactionOutput[] = this.utils.updateUTxOutsWithNewTxs(uTxOuts, newTransactions);

        this.save(updatedUTxOuts);
    }

    private async load(): Promise<UnspentTransactionOutput[]> {
        return this.storage.get(this.FILE_NAME);
    }

    private save(transactions: UnspentTransactionOutput[]): Promise<void> {
        return this.storage.set(this.FILE_NAME, transactions);
    }
}