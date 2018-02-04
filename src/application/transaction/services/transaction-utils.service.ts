import { Component } from '@nestjs/common';

import * as ecdsa from 'elliptic';

import { Transaction } from '../classes/transaction';
import { CryptoService } from '../../crypto/crypto.service';
import { TransactionInput } from '../classes/transaction-input';
import { TransactionOutput } from '../classes/transaction-output';

@Component()
export class TransactionUtilsService {
    constructor(private crypto: CryptoService) {

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

    createCoinbaseTransaction(address, blockIndex, coinbaseAmount) {
        const inputs = [new TransactionInput('', blockIndex, '')];
        const outputs = [new TransactionOutput(address, coinbaseAmount)];

        const tx = new Transaction('', inputs, outputs);

        tx.id = this.calcTransactionId(tx);
        return tx;
    }

    signTxId(tx, txInIndex, privateKey, unspentTxOutputs) {
        const txInput = tx.inputs[txInIndex];

        const referencedUnspentTxOut = this.findUnspentTxOutput(txInput.txOutputId, txInput.txOutputIndex, unspentTxOutputs);
        const referencedAddress = referencedUnspentTxOut.address;

        const key = this.getPublicKey(privateKey);
        const dataToSign = tx.id;

        const signature = toHexString(key.sign(dataToSign).toDER()); // todo move to a service

        return signature;
    }

    signTxIn(tx, txInIndex, privateKey, aUnspentTxOuts) {
        const txIn = tx.inputs[txInIndex];

        const dataToSign = tx.id;
        const referencedUnspentTxOut = this.findUnspentTxOutput(txIn.txOutputId, txIn.txOutputIndex, aUnspentTxOuts);
        if(referencedUnspentTxOut == null) {
            this._logger.log('could not find referenced txOut');
            throw Error();
        }
        const referencedAddress = referencedUnspentTxOut.address;

        if (this.getPublicKey(privateKey) !== referencedAddress) {
            throw Error('trying to sign an input with private' +
                ' key that does not match the address that is referenced in txIn');
        }

        const ec = new ecdsa.ec('secp256k1'); // todo encapsulate ec
        
        const key = ec.keyFromPrivate(privateKey, 'hex');
        const signature = toHexString(key.sign(dataToSign).toDER());

        return signature;
    }

    getTxInputAmount (txInput, uTxOutputs) {
        return this.findUnspentTxOutput(
            txInput.txOutputId,
            txInput.txOutputIndex,
            uTxOutputs
        ).amount;
    }

    findUnspentTxOutput(txId, txOutputIndex, unspentTxOutputs) {
        return unspentTxOutputs.find((uTxOutput) => {
            return (uTxOutput.txOutputId === txId) && (uTxOutput.txOutputIndex === txOutputIndex);
        });
    }

    getPublicKey(privateKey) {
        const ec = new ecdsa.ec('secp256k1');

        return ec
            .keyFromPrivate(privateKey, 'hex')
            .getPublic()
            .encode('hex');
    }

    retrieveNewUnspentTxOutputs(transactions) {
        return transactions
            .map((tx) => {
                return tx.outputs.map((txOutput, index) => new UnspentTransactionOutput(tx.id, index, txOutput.address, txOutput.amount));
            })
            .reduce((a, b) => a.concat(b), []);
    }

    retrieveConsumedTxOutputs(transactions) {
        return transactions
            .map((tx) => tx.inputs)
            .reduce((a, b) => a.concat(b), [])
            .map((txInput) => new UnspentTransactionOutput(txInput.txOutputId, txInput.txOutputIndex, '', 0));
    }

    retreiveResultingUnspentTxOutputs(unspentTxOutputs, newUnspentTxOutputs, consumedTxOutputs) {
        unspentTxOutputs
            .filter(((uTxOutput) => !this.findUnspentTxOutput(uTxOutput.txOutputId, uTxOutput.txOutputIndex, consumedTxOutputs)))
            .concat(newUnspentTxOutputs);
    }
}