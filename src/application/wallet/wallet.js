import { Injectable, Inject } from 'container-ioc';
import { ec } from 'elliptic';
import _ from 'lodash';

import { TLogger } from "../../system/logger/logger";
import {TxInput} from "../transaction/classes/tx-input";
import {TxOutput} from "../transaction/classes/tx-output";
import {Transaction} from "../transaction/classes/tx";
import {TxUtilsService} from "../transaction/services/tx-utils.service";
import {KeysService} from "./keys.service";
import {Configuration} from "../../bootstrap/configuration";
import {TWalletRepository} from "./wallet-repository/wallet-repository";

const EC = new ec('secp256k1');

// todo replace SYNC operations
@Injectable([
    Configuration,
    TWalletRepository,
    KeysService,
    TxUtilsService,
    TLogger
])
export class Wallet {
    constructor(
        @Inject(Configuration) config,
        @Inject(TWalletRepository) repository,
        @Inject(KeysService) keysService,
        @Inject(TxUtilsService) txUtilsService,
        @Inject(TLogger) logger
    ) {
        this._config = config;
        this._repository= repository;
        this._keysService = keysService;
        this._txUtilsService = txUtilsService;
        this._logger = logger;

        this._initWallet();
    }

    async generateNew() {
        return this._keysService.generateKeyPair();
    }

    async createTx(receiverPublicKey, amount, senderPrivateKey, uTxOutputs, txPool) {
        const senderPublicKey = this._txUtilsService.getPublicKey(senderPrivateKey);

        let senderUnspentTxOutputs = this._filterUTxOutputsForAddress(senderPublicKey, uTxOutputs);

        senderUnspentTxOutputs = this.filterTxPoolTxs(senderUnspentTxOutputs, txPool);

        const {
            includedUnspentTxOuts,
            leftOverCoinsAmount
        } = this._searchUnspentTxOutputsForAmount(amount, senderUnspentTxOutputs);

        const newUnsignedTxInputs = this._uTxOutputsToUnsignedTxInputs(includedUnspentTxOuts);

        const newTxOuts = this._createTxOutputs(
            receiverPublicKey,
            senderPublicKey,
            amount,
            leftOverCoinsAmount
        );

        const newTx = new Transaction();
        newTx.inputs = newUnsignedTxInputs;
        newTx.outputs = newTxOuts;
        newTx.id = this._txUtilsService.getTxId(newTx);

        this._signTxInputs(newTx, senderPrivateKey, uTxOutputs);

        return newTx;
    }

    async getBalance(address, unTxOutputs) {
        return unTxOutputs
            .filter(uTxOutput => uTxOutput.address === address)
            .map((uTxOutput) => uTxOutput.amount)
            .reduce((a, b) => a + b, 0);
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

    async _initWallet() {
        if (await this._repository.isSaved()) {
            return;
        }

        const newPrivateKey = this._keysService.generatePrivateKey();

        await this._storeWallet(newPrivateKey);

        this._logger.log('new wallet with private key created');
    }

    async _storeWallet(wallet) {
        try {
            await this._repository.save(wallet);
        } catch (e) {
            this._logger.error(e.message);
        }
    }

    // todo should return keypair
    async _retreieveWallet() {
        const privateKey = this._repository.get();
        const key = EC.keyFromPrivate(privateKey, 'hex');
        return key.getPublic().encode('hex')
    }

    _createTxOutputs(receiverAddress, senderAddress, amount, leftOverAmount) {
        const outputs = [
            new TxOutput(receiverAddress, amount)
        ];

        if (leftOverAmount > 0) {
            outputs.push(new TxOutput(senderAddress, leftOverAmount));
        }

        return outputs;
    }

    _signTxInputs(tx, privateKey, uTxOutputs) {
        tx.inputs.forEach((txInput, txInputIndex) => {
            txInput.signature = this._txUtilsService
                .signTxIn(tx, txInputIndex, privateKey, uTxOutputs);
        });
    }

    _filterUTxOutputsForAddress(address, uTxOutputs) {
        return uTxOutputs.filter(uTxOutput => uTxOutput.address === address);
    }

    _searchUnspentTxOutputsForAmount(amount, uTxOutputs) {
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

    _uTxOutputsToUnsignedTxInputs(unspentTxOutputs) {
        return unspentTxOutputs.map(uTxOutput => this._uTxOutputToUnsignedTxInput(uTxOutput));
    }

    _uTxOutputToUnsignedTxInput(uTxOutput) {
        const txIn = new TxInput();
        txIn.txOutputId = uTxOutput.txOutputId;
        txIn.txOutputIndex = uTxOutput.txOutputIndex;
        return txIn;
    }
}