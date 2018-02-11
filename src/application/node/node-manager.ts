import { Component } from '@nestjs/common';
import { IBlock } from '../block/block.interface';
import { Node } from './node';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { Transaction } from '../transaction/classes/transaction';
import { P2PNetwork } from '../p2p-network/p2p-network';

@Component()
export class NodeManager {
    constructor(
        private node: Node,
        private p2p: P2PNetwork
    ) { }

    async getBlocks(): Promise<IBlock[]> {
        return this.node.getBlocks();
    }

    async getLastBlock(): Promise<IBlock> {
        return this.node.getLastBlock();
    }

    async getUnspentTxOutputs(): Promise<UnspentTransactionOutput[]> {
        return this.node.getUnspentTxOutputs();
    }

    async getTxPool(): Promise<Transaction[]> {
        return this.node.getTxPool();
    }

    async addPeer(address: string): Promise<void> {
        await this.p2p.addPeer(address);
    }

    // todo
    async getPeers(): Promise<any[]> {
        return await this.p2p.getPeers();
    }

    async mineNewBlock(): Promise<IBlock> {
        return await this.node.mineNewBlock();
    }
}