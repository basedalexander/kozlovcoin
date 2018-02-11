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

    async update(newBlock: IBlock): Promise<void> {
        const uTxOuts: UnspentTransactionOutput[] = await this.get();
        const updatedUTxOuts: UnspentTransactionOutput[] = this.utils.updateUTxOutsWithNewTxs(uTxOuts, newBlock.data);
        this.save(updatedUTxOuts);
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

    private async load(): Promise<UnspentTransactionOutput[]> {
        let loadResult: UnspentTransactionOutput[] = await this.storage.get(this.FILE_NAME);

        if (!loadResult) {
            loadResult = [];
        }

        return loadResult;
    }

    private async save(transactions: UnspentTransactionOutput[]): Promise<void> {
        await this.storage.set(this.FILE_NAME, transactions);
    }
}