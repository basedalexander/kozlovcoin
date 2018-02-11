import { Component } from '@nestjs/common';
import { Transaction } from '../transaction/classes/transaction';
import { TransactionFactory } from '../transaction/transaction-factory/transaction-factory';
import { Node } from '../node/node';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { ICreateTransactionParamsInterface } from './create-transaction-params.interface';
import { CryptoService } from '../crypto/crypto.service';
import { KeyPair } from '../crypto/key-pair';

@Component()
export class WalletManager {
    constructor(private transactionFactory: TransactionFactory,
                private node: Node,
                private crypto: CryptoService
    ) {

    }

    async createTransaction(params: ICreateTransactionParamsInterface): Promise<Transaction> {
        const txPool: Transaction[] = await this.node.getTxPool();
        const uTxOuts: UnspentTransactionOutput[] = await this.node.getUnspentTxOutputs();

        const newTx: Transaction = await this.transactionFactory.create({
            amount: params.amount,
            recipientPublicKey: params.recipientPublicKey,
            senderPublicKey: params.senderPublicKey,
            senderPrivateKey: params.senderPrivateKey,
            uTxOuts,
            txPool
        });

        await this.node.addTransaction(newTx);

        return newTx;
    }

    async generateNewKeyPair(): Promise<KeyPair> {
        return this.crypto.generateKeyPair();
    }

    async getBalance(publicKey: string): Promise<number> {
        const uTxOuts: UnspentTransactionOutput[] = await this.node.getUnspentTxOutputs();

        const balance: number = uTxOuts
            .filter(uTxOut => uTxOut.address === publicKey)
            .map(uTxOut => uTxOut.amount)
            .reduce((a, b) => a + b, 0);

        return balance;
    }

    async getTransactions(address: string): Promise<any[]> {
        return [];
    }
}