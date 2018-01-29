import { Injectable } from 'container-ioc';
import * as ecdsa from 'elliptic';
import crypto from 'crypto';

import { toHexString } from "../../../lib/utils";
import { UnspentTxOutput } from "./unspent-tx-output";

@Injectable()
export class TxUtilsService {
    getTxId(tx) {
        const txInContent = tx.inputs
            .map((txInput) => txInput.txOutputId + txInput.txOutputIndex)
            .reduce((a, b) => a + b, '');

        const txOutContent = tx.outputs
            .map((txOutput) => txOutput.address + txOutput.amount)
            .reduce((a, b) => a + b, '');

        return crypto.createHash('sha256')
            .update(txInContent + txOutContent)
            .digest('hex');
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
                return tx.outputs.map((txOutput, index) => new UnspentTxOutput(tx.id, index, txOutput.address, txOutput.amount));
            })
            .reduce((a, b) => a.concat(b), []);
    }

    retrieveConsumedTxOutputs(transactions) {
        return transactions
            .map((tx) => tx.inputs)
            .reduce((a, b) => a.concat(b), [])
            .map((txInput) => new UnspentTxOutput(txInput.txOutputId, txInput.txOutputIndex, '', 0));
    }

    retreiveResultingUnspentTxOutputs(unspentTxOutputs, newUnspentTxOutputs, consumedTxOutputs) {
        unspentTxOutputs
            .filter(((uTxOutput) => !this.findUnspentTxOutput(uTxOutput.txOutputId, uTxOutput.txOutputIndex, consumedTxOutputs)))
            .concat(newUnspentTxOutputs);
    }
}