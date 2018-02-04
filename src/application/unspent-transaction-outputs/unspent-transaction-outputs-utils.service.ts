import { Component } from '@nestjs/common';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { Transaction } from '../transaction/classes/transaction';

@Component()
export class UnspentTransactionOutputsUtilsService {

    public txsToUnspentTxOuts(transactions: Transaction[]): UnspentTransactionOutput[] {
        return transactions
            .map((transaction) => {
                return transaction.outputs.map((transactionOutput, outputTxIndex) => {
                    return new UnspentTransactionOutput(
                        transaction.id,
                        outputTxIndex,
                        transactionOutput.address,
                        transactionOutput.amount
                    );
                });
            })
            .reduce((a, b) => a.concat(b), []);
    }

    public txsToConsumedTxOuts(transactions: Transaction[]): UnspentTransactionOutput[] {
        const consumedTxOuts: UnspentTransactionOutput[] =
            transactions
                .map(t => t.inputs)
                .reduce((a, b) => a.concat(b), [])
                .map(txInput => {
                    return new UnspentTransactionOutput(
                        txInput.txOutputId,
                        txInput.txOutputIndex,
                        '',
                        0
                    );
                });

        return consumedTxOuts;
    }

    public removeConsumedUTxOuts(
        unspentTxOuts: UnspentTransactionOutput[],
        consumedUTxOuts: UnspentTransactionOutput[]
    ): UnspentTransactionOutput[] {

        return unspentTxOuts.filter((uTxOut) => !this.findUTxOut(uTxOut, consumedUTxOuts));
    }

    public addNewUTxOuts(
        unspentTxOuts: UnspentTransactionOutput[],
        newUTxOuts: UnspentTransactionOutput[]
    ): void {
        unspentTxOuts.push(...newUTxOuts);
    }

    private findUTxOut(uTxOut: UnspentTransactionOutput, list: UnspentTransactionOutput[]): UnspentTransactionOutput {
        return list.find(output => {
            return (uTxOut.txOutputId === output.txOutputId) && (uTxOut.txOutputIndex === output.txOutputIndex);
        });
    }
}