import { Injectable, Inject } from 'container-ioc';
import { ec } from 'elliptic';
import * as _ from 'lodash';

import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

import { TLogger } from "../../system/logger/logger";
import {TxInput} from "../transaction/tx-input";
import {TxOutput} from "../transaction/tx-output";
import {Transaction} from "../transaction/tx";
import {TxUtilsService} from "../transaction/tx-utils.service";

const EC = new ec('secp256k1');

// todo replace SYNC operations
@Injectable([TxUtilsService, TLogger])
class Wallet {
    constructor(
        @Inject(TxUtilsService) txUtilsService,
        @Inject(TLogger) logger
    ) {
        this._txUtilsService = txUtilsService;
        this._logger = logger;

        this.PRIVATE_KEY_LOCATION = 'node/wallet/private_key';
    }

    async sendCoins(receiverAddress, amount, uTxOutputs) {
        const senderPrivateKey = this.getPrivateKeyFromWallet();
        const senderPublicKey = this.getPublicKeyFromWallet();

        const newTx = new Transaction();

        const newUnsignedTxInputs = this.uTxOutputsToUnsignedTxInputs(matchedTxOutputsData.includedUnspentTxOuts);
        const matchedTxOutputsData = this.findUnspentTxOutputsForAmount(amount, uTxOutputs);

        const newTxOuts = this.createTxOutputs(
            receiverAddress,
            senderPublicKey,
            amount,
            matchedTxOutputsData.leftOverAmount
        );

        newTx.inputs = newUnsignedTxInputs;
        newTx.outputs = newTxOuts;
        newTx.id = this._txUtilsService.getTxId(newTx);

        this.signTxInputs(newTx, senderPrivateKey, uTxOutputs);
    }

    generatePrivateKey() {
        const keyPair = EC.genKeyPair();
        const privateKey = keyPair.getPrivate();
        return privateKey.toString(16);
    }

    initWallet() {
        if (existsSync(this.PRIVATE_KEY_LOCATION)) {
            return;
        }

        const newPrivateKey = this.generatePrivatekey();

        writeFileSync(this.PRIVATE_KEY_LOCATION, newPrivateKey);

        this._logger.log('new wallet with private key created');
    }

    getPublicKeyFromWallet() {
        const privateKey = this.getPrivateKeyFromWallet();
        const key = EC.keyFromPrivate(privateKey, 'hex');
        return key.getPublic().encode('hex');
    }

    getPrivateKeyFromWallet() {
        const buffer = readFileSync(this.PRIVATE_KEY_LOCATION, 'utf8');
        return buffer.toString();
    }

    // todo get rid of lodash
    getBalance(address, unspentTxOutputs) {
        return _(unspentTxOutputs)
            .filter(uTxOutput => uTxOutput.address === address)
            .map((uTxOutput) => uTxOutput.amount)
            .sum();
    }

    createTxOutputs(receiverAddress, senderAddress, amount, leftOverAmount) {
        const outputs = [
            new TxOutput(receiverAddress, amount)
        ];

        if (leftOverAmount > 0) {
            outputs.push(new TxOutput(senderAddress, leftOverAmount));
        }

        return outputs;
    }

    signTxInputs(tx, privateKey, uTxOutputs) {
        tx.inputs.forEach((txInput, txInputIndex) => {
            txInput.signature = this._txUtilsService
                .signTxIn(tx, txInputIndex, privateKey, uTxOutputs);
        });
    }

    findUnspentTxOutputsForAmount(amount, uTxOutputs) {
        let currentAmount = 0;
        const includedUTxOutputs = [];

        for (const uTxOutput of uTxOutputs) {
            includedUTxOutputs.push(uTxOutput);
            currentAmount = currentAmount + uTxOutput.amount;

            if (currentAmount >= amount) {
                const leftOverAmount = currentAmount - amount;
                return {
                    includedUnspentTxOuts: includedUTxOutputs,
                    leftOverAmount
                }
            }
        }
        throw Error('not enough coins to send transaction');
    }

    uTxOutputsToUnsignedTxInputs(unspentTxOutputs) {
        return unspentTxOutputs.map(uTxOutput => this.uTxOutputToUnsignedTxInput(uTxOutput));
    }

    uTxOutputToUnsignedTxInput(uTxOutput) {
        const txIn = new TxInput();
        txIn.txOutputId = uTxOutput.txOutputId;
        txIn.txOutputIndex = uTxOutput.txOutputIndex;
        return txIn;
    }
}