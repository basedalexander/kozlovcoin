import { Injectable, Inject } from 'container-ioc';
import { ec } from 'elliptic';
import * as _ from 'lodash';

import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

import { TLogger } from "../../system/logger/logger";
import {TxInput} from "../transaction/classes/tx-input";
import {TxOutput} from "../transaction/classes/tx-output";
import {Transaction} from "../transaction/classes/tx";
import {TxUtilsService} from "../transaction/services/tx-utils.service";
import {KeysService} from "./keys.service";

const EC = new ec('secp256k1');

// todo replace SYNC operations
@Injectable([
    KeysService,
    TxUtilsService,
    TLogger
])
export class Wallet {
    constructor(
        @Inject(KeysService) keysService,
        @Inject(TxUtilsService) txUtilsService,
        @Inject(TLogger) logger
    ) {
        this._keysService = keysService;
        this._txUtilsService = txUtilsService;
        this._logger = logger;
    }

    async createTx(receiverPublicKey, amount, senderPrivateKey, uTxOutputs, txPool) {
        const senderPublicKey = this._txUtilsService.getPublicKey(senderPrivateKey);

        let senderUnspentTxOutputs = this.filterUTxOutputsForAddress(senderPublicKey, uTxOutputs);

        senderUnspentTxOutputs = this.filterTxPoolTxs(senderUnspentTxOutputs, txPool);

        const {
            includedUnspentTxOuts,
            leftOverCoinsAmount
        } = this.searchUnspentTxOutputsForAmount(amount, senderUnspentTxOutputs);

        const newUnsignedTxInputs = this.uTxOutputsToUnsignedTxInputs(includedUnspentTxOuts);

        const newTxOuts = this.createTxOutputs(
            receiverPublicKey,
            senderPublicKey,
            amount,
            leftOverCoinsAmount
        );

        const newTx = new Transaction();
        newTx.inputs = newUnsignedTxInputs;
        newTx.outputs = newTxOuts;
        newTx.id = this._txUtilsService.getTxId(newTx);

        this.signTxInputs(newTx, senderPrivateKey, uTxOutputs);

        return newTx;
    }

    // todo refactor
    filterTxPoolTxs(unspentTxOuts, transactionPool) {
        const txIns = _(transactionPool)
            .map(tx => tx.inputs)
            .flatten()
            .value();

        const removableUTxOutputs = [];
        for (const unspentTxOut of unspentTxOuts) {
            const txIn = _.find(txIns, aTxIn => {
                return aTxIn.txOutIndex === unspentTxOut.txOutIndex && aTxIn.txOutId === unspentTxOut.txOutId;
            });

            if (txIn !== undefined) {
                removableUTxOutputs.push(unspentTxOut);
            }
        }

        return _.without(unspentTxOuts, ...removableUTxOutputs);
    }

    initWallet() {
        if (existsSync(this.PRIVATE_KEY_LOCATION)) {
            return;
        }

        const newPrivateKey = this._keysService.generatePrivateKey();

        writeFileSync(this.PRIVATE_KEY_LOCATION, newPrivateKey);

        this._logger.log('new wallet with private key created');
    }

    storeWallet() {

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

    filterUTxOutputsForAddress(address, uTxOutputs) {
        return uTxOutputs.filter(uTxOutput => uTxOutput.address === address);
    }

    searchUnspentTxOutputsForAmount(amount, uTxOutputs) {
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