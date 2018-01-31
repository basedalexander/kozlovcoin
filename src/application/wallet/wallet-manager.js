import {Injectable} from "container-ioc";

import { Node } from '../node';
import {Wallet} from "./wallet";

@Injectable([
    Node,
    Wallet
])
export class WalletManager {
    constructor(
        @Inject(Node) node,
        @Inject(Wallet) wallet,
    ) {
        this._node = node;
        this._wallet = wallet;
    }

    async getNewWallet() {
        return this._wallet.generateNew();
    }

    async sendCoins(txData) {
        const valid = this._validateIncomingTxDataStructure(txData);
        if (!valid) {
            return false;
        }

        const unTxOutputs = await this._node.getUnspentTxOutputs();
        const txPool = await this._node.getTxPool();

        const newTx = await this._wallet.createTx(
            txData.to,
            txData.amount,
            txData.from.privateKey,
            unTxOutputs,
            txPool
        );

        await this._node.addTx(newTx);

        return newTx;
    }

    // todo move out of the class
    _validateIncomingTxDataStructure(txData) {
        if (!txData) {
            return false;
        }

        if (!txData.to || (typeof txData.to !== 'string')) {
            return false;
        }

        if (!txData.amount) {
            return false;
        }

        if (!txData.from || !txData.from.publicKey || (typeof txData.from.publicKey !== 'string') ) {
            return false;
        }

        if (!txData.from || !txData.from.privateKey || (typeof txData.from.privateKey !== 'string') ) {
            return false;
        }

        return true;
    }

    async getBalance(address) {
        const unTxOutputs = await this._node.getUnspentTxOutputs();

        return await this._wallet.getBalance(address, unTxOutputs);
    }
}