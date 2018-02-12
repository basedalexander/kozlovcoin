import { Component, Inject } from '@nestjs/common';

import { Transaction } from '../classes/transaction';
import { CryptoService } from '../../crypto/crypto.service';
import { TransactionInput } from '../classes/transaction-input';
import { UnspentTransactionOutput } from '../classes/unspent-transaction-output';
import { ILogger, TLogger } from '../../../system/logger/interfaces/logger.interface';

@Component()
export class TransactionUtilsService {
    constructor(
        private crypto: CryptoService,
        @Inject(TLogger) private logger: ILogger
    ) {
    }

    public calcTransactionId(tx: Transaction): string {
        const txInContent = tx.inputs
            .map((txInput) => txInput.txOutputId + txInput.txOutputIndex)
            .reduce((a, b) => a + b, '');

        const txOutContent = tx.outputs
            .map((txOutput) => txOutput.address + txOutput.amount)
            .reduce((a, b) => a + b, '');

        const id = `${tx.timeStamp}${txInContent}${txOutContent}`;

        return this.crypto.createSHA256Hash(id);
    }

    public findUTxOutsForAmount(uTxOuts: UnspentTransactionOutput[], amount: number): UnspentTransactionOutput[] {
        let currentAmount = 0;
        let includedUTxOutputs = [];

        for (const uTxOutput of uTxOuts) {
            includedUTxOutputs.push(uTxOutput);
            currentAmount = currentAmount + uTxOutput.amount;

            if (currentAmount >= amount) {
                break;
            }
        }

        if (currentAmount < amount) {
            includedUTxOutputs = [];
        }

        return includedUTxOutputs;
    }

    public getLeftOverAmount(uTxOuts: UnspentTransactionOutput[], amount: number): number {
        let result: number = amount;

        for (const uTxOutput of uTxOuts) {
            const outputAmount: number = uTxOutput.amount;

            if (outputAmount > result) {
                result = outputAmount - result;
                break;
            }

            result = result - outputAmount;

            if (result <= 0) {
                result = 0;
                break;
            }
        }

        return result;
    }

    public getTotalInputAmount(tx: Transaction, uTxOuts: UnspentTransactionOutput[]): number {
        const inputAmounts: number[] = tx.inputs
            .map(txInput => this.getTxInputAmount(txInput, uTxOuts));

        const total: number = inputAmounts.reduce((a, b) => (a + b), 0);

        return total;
    }

    public getTxInputAmount(txInput: TransactionInput, uTxOuts: UnspentTransactionOutput[]): number {
        const referencedTxOutput: UnspentTransactionOutput = this.findUTxOutByTxIn(txInput, uTxOuts);

        return referencedTxOutput.amount;
    }

    public getTotalOutputAmount(tx: Transaction): number {
        const outputAmounts: number[] = tx.outputs.map(txOut => txOut.amount);
        const total: number = outputAmounts.reduce((a, b) => (a + b), 0);

        return total;
    }

    public getUTxOutsForAddress(address: string, uTxOuts: UnspentTransactionOutput[]): UnspentTransactionOutput[] {
        return uTxOuts.filter(tx => tx.address === address);
    }

    public convertUTxOutsToUnsignedTxInputs(uTxOuts: UnspentTransactionOutput[]): TransactionInput[] {
        return uTxOuts.map(uTxOutput => this.uTxOutToUnsignedTxInput(uTxOutput));
    }

    public signTxInputs(tx: Transaction, privateKey: string, uTxOuts: UnspentTransactionOutput[]): void {
        tx.inputs.forEach(txInput => {
            txInput.signature = this.crypto.signMessage(tx.id, privateKey);
        });
    }

    public getCurrentTimeStamp(): number {
        return Date.now();
    }

    private findUTxOutByTxIn(txInput: TransactionInput, uTxOuts: UnspentTransactionOutput[]): UnspentTransactionOutput {
        return uTxOuts.find(uTxOutput => {
            return (uTxOutput.txOutputId === txInput.txOutputId) &&
                   (uTxOutput.txOutputIndex === txInput.txOutputIndex);
        });
    }

    private uTxOutToUnsignedTxInput(uTxOutput: UnspentTransactionOutput) {
        return new TransactionInput(
            uTxOutput.txOutputId,
            uTxOutput.txOutputIndex,
            ''
        );
    }
}