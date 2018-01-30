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

    async sendCoins(address, amount) {
        if (!!address || !!amount) {
            return false;
        }

        const unTxOutputs = this._node.getUnspentTxOutputs();
        const txPool = this._node.getTxPool();
        const privateKey = await this._wallet.getPrivateKeyFromWallet();
        const newTx = await this._wallet.createTx(address, amount, privateKey, unTxOutputs, txPool);

        await this._node.addTx(newTx);

        return true;
    }
}