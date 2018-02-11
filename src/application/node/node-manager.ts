import { Component, Inject } from '@nestjs/common';
import { IBlock } from '../block/block.interface';
import { Node } from './node';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { Transaction } from '../transaction/classes/transaction';
import { P2PNetwork } from '../p2p-network/p2p-network';
import { ILogger, TLogger } from '../../system/logger/interfaces/logger.interface';
import { BlockValidatorService } from '../block/block-validator.service';
import { P2PMessageType } from '../p2p-network/messages/interfaces/p2p-message-type';
import { P2PMessageFactory } from '../p2p-network/messages/p2p-message-factory';
import { UnspentTransactionOutputs } from '../unspent-transaction-outputs/unspent-transaction-outputs';
import { TransactionPool } from '../transaction-pool/transaction-pool';

@Component()
export class NodeManager {
    constructor(
        private node: Node,
        private p2p: P2PNetwork,
        @Inject(TLogger) private logger: ILogger,
        private blockValidator: BlockValidatorService,
        private messageFactory: P2PMessageFactory,
        private unTxOuts: UnspentTransactionOutputs,
        private txPool: TransactionPool
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

    async handleReceivedLastBlock(block: IBlock, sender: WebSocket): Promise<void> {
        if (!this.blockValidator.validateStructure(block)) {
            this.logger.error('Received last block has invalid structure, ignoring');
            return;
        }

        const heldLastBlock: IBlock = await this.node.getLastBlock();

        if (block.index > heldLastBlock.index) {
            if (block.previousBlockHash === heldLastBlock.hash) {
                await this.node.addNewBlock(block);
                await this.unTxOuts.update(block);
                await this.txPool.clear(); // todo should not be cleared, but rather updated

                const msg = this.messageFactory.createMessage(
                    P2PMessageType.RESPONSE_LAST_BLOCK,
                    block
                );
                this.p2p.broadcast(msg);
            } else {
                this.logger.error(`Node: Adding new block, received block ${block.hash} either higher then our last block or not valid`);

                const msg = this.messageFactory.createMessage(
                    P2PMessageType.QUERY_ALL_BLOCKS
                );
                this.p2p.sendMessage(sender, msg);
            }
        }
    }
}