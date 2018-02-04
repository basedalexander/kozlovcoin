import { Component } from '@nestjs/common';

import { IBlock } from '../block/block.interface';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { InMemoryStorage } from '../storage/in-memory-storage';
import { Transaction } from '../transaction/classes/transaction';
import { UnspentTransactionOutputsUtilsService } from './unspent-transaction-outputs-utils.service';

@Component()
export class UnspentTransactionOutputs {
    private FILE_NAME: string = 'utxoutputs.json';

    constructor(
        private storage: InMemoryStorage, // todo use fs storage
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
        const uTxOuts: UnspentTransactionOutput[] = [];

        blocks.forEach(block => {
            this.updateWithNewTxs(uTxOuts, block.data);
        });

        await this.save(uTxOuts);
    }

    async updateWithNewTxs(existingUTxOuts: UnspentTransactionOutput[], newTransactions: Transaction[]): Promise<void> {
        const newUTxOutputs: UnspentTransactionOutput[] = this.utils.txsToUnspentTxOuts(newTransactions);
        const consumedUTxOuts: UnspentTransactionOutput[] = this.utils.txsToConsumedTxOuts(newTransactions);

        this.utils.removeConsumedUTxOuts(existingUTxOuts, consumedUTxOuts);
        this.utils.addNewUTxOuts(existingUTxOuts, newUTxOutputs);
    }

    private async update(newTransactions: Transaction[]): Promise<void> {
        const uTxOuts: UnspentTransactionOutput[] = await this.get();

        this.updateWithNewTxs(uTxOuts, newTransactions);

        this.save(uTxOuts);
    }

    private async load(): Promise<UnspentTransactionOutput[]> {
        return this.storage.get(this.FILE_NAME);
    }

    private save(transactions: UnspentTransactionOutput[]): Promise<void> {
        return this.storage.set(this.FILE_NAME, transactions);
    }
}