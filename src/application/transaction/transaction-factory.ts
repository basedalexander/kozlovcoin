import { Component } from '@nestjs/common';
import { TransactionInput } from './classes/transaction-input';
import { TransactionOutput } from './classes/transaction-output';
import { Transaction } from './classes/transaction';
import { TransactionUtilsService } from './services/transaction-utils.service';

@Component()
export class TransactionFactory {
    constructor(private utils: TransactionUtilsService) {

    }

    public createGenesis(publicAddress, coinbaseAmount) {
        const genesisInputTransaction = new TransactionInput('', 0, '');
        const genesisOutputTransaction = new TransactionOutput(publicAddress, coinbaseAmount);

        const tx = new Transaction('', [genesisInputTransaction], [genesisOutputTransaction]);

        tx.id = this.utils.calcTransactionId(tx);

        return tx;
    }

    public createCoinbaseTransaction(address: string, blockIndex: number, coinbaseAmount: number) {

    }
}