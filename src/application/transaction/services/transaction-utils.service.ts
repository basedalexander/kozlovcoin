import { Component, Inject } from '@nestjs/common';

import * as ecdsa from 'elliptic';

import { Transaction } from '../classes/transaction';
import { CryptoService } from '../../crypto/crypto.service';
import { TransactionInput } from '../classes/transaction-input';
import { UnspentTransactionOutput } from '../classes/unspent-transaction-output';
import { ILogger, TLogger } from '../../../system/logger/interfaces/logger.interface';
import { toHexString } from '../../../lib/utils';

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

        const id = `${txInContent}${txOutContent}`;

        return this.crypto.createSHA256Hash(id);
    }

    public searchUTxOutsForAmount(uTxOuts: UnspentTransactionOutput[], amount: number): UnspentTransactionOutput[] {
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

    public getUTxOutsForAddress(address: string, uTxOuts: UnspentTransactionOutput[]): UnspentTransactionOutput[] {
        return uTxOuts.filter(tx => tx.address === address);
    }

    public uTxOutsToUnsignedTxInputs(uTxOuts: UnspentTransactionOutput[]): TransactionInput[] {
        return uTxOuts.map(uTxOutput => this.uTxOutToUnsignedTxInput(uTxOutput));
    }

    public validateTx(tx: Transaction, privateKey: string, uTxOuts: UnspentTransactionOutput[]): boolean {
        return tx.inputs.every(txInput => {
            return this.validateTxInput(txInput, privateKey, uTxOuts);
        });
    }

    public signTxInputs(tx: Transaction, privateKey: string, uTxOuts: UnspentTransactionOutput[]): void {
        tx.inputs.forEach(txInput => {
            txInput.signature = this.getSignatureForTxInput(tx, txInput, privateKey, uTxOuts);
        });
    }

    private getSignatureForTxInput(tx: Transaction, txInput: TransactionInput, privateKey: string, uTxOuts: UnspentTransactionOutput[]): string {
        return this.signData(tx.id, privateKey);
    }

    private validateTxInput(txInput: TransactionInput, privateKey: string, uTxOuts: UnspentTransactionOutput[]): boolean {
        const referencedUTxOut: UnspentTransactionOutput = this.findUTxOutByTxIn(txInput, uTxOuts);

        if (!referencedUTxOut) {
            this.logger.error(`Signing tx input error: could not find referenced txOut`);
            return false;
        }

        if (this.getPublicKey(privateKey) !== referencedUTxOut.address) {
            this.logger.error(`Signing tx input error: private key does not match refferenced output's address`);
            return false;
        }

        return true;
    }

    private signData(data: string, privateKey: string): string {
        const ec = new ecdsa.ec('secp256k1'); // todo encapsulate ec

        const key = ec.keyFromPrivate(privateKey, 'hex');
        const signature = toHexString(key.sign(data).toDER());

        return signature;
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

    // todo move to key service
    private getPublicKey(privateKey: string) {
        const ec = new ecdsa.ec('secp256k1');

        return ec
            .keyFromPrivate(privateKey, 'hex')
            .getPublic()
            .encode('hex');
    }
}