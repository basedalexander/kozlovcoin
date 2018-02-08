import { Component } from '@nestjs/common';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { Transaction } from '../transaction/classes/transaction';

@Component()
export class UnspentTransactionOutputsUtilsService {

    public convertTxsToUnspentTxOuts(transactions: Transaction[]): UnspentTransactionOutput[] {
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

    public updateUTxOutsWithNewTxs(existingUTxOuts: UnspentTransactionOutput[], newTransactions: Transaction[]): UnspentTransactionOutput[] {
        const newUTxOutputs: UnspentTransactionOutput[] = this.convertTxsToUnspentTxOuts(newTransactions);
        const consumedUTxOuts: UnspentTransactionOutput[] = this.convertTxsToConsumedTxOuts(newTransactions);

        const processedExistingUTxOuts: UnspentTransactionOutput[] = this.filterOutConsumedUTxOuts(existingUTxOuts, consumedUTxOuts);
        const processedNewUTxOuts: UnspentTransactionOutput[] = this.filterOutConsumedUTxOuts(newUTxOutputs, consumedUTxOuts);

        const updatedExistingUTxOuts: UnspentTransactionOutput[] = processedExistingUTxOuts.concat(processedNewUTxOuts);

        return updatedExistingUTxOuts;
    }

    public convertTxsToConsumedTxOuts(transactions: Transaction[]): UnspentTransactionOutput[] {
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

    public filterOutConsumedUTxOuts(
        unspentTxOuts: UnspentTransactionOutput[],
        consumedUTxOuts: UnspentTransactionOutput[]
    ): UnspentTransactionOutput[] {

        return unspentTxOuts.filter((uTxOut) => !this.findUTxOutput(uTxOut, consumedUTxOuts));
    }

    public addNewUTxOuts(
        unspentTxOuts: UnspentTransactionOutput[],
        newUTxOuts: UnspentTransactionOutput[]
    ): void {
        unspentTxOuts.push(...newUTxOuts);
    }

    private findUTxOutput(uTxOut: UnspentTransactionOutput, uTxOutputs: UnspentTransactionOutput[]): UnspentTransactionOutput {
        return uTxOutputs.find(output => {
            return (uTxOut.txOutputId === output.txOutputId) && (uTxOut.txOutputIndex === output.txOutputIndex);
        });
    }
}