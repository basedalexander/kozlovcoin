import { Component } from '@nestjs/common';
import { IBlock } from '../block/block.interface';
import { Node } from './node';

@Component()
export class NodeManager {
    constructor(
        private node: Node
    ) { }

    async getBlocks(): Promise<IBlock[]> {
        return this.node.getBlocks();
    }

    async getLastBlock(): Promise<IBlock> {
        return this.node.getLastBlock();
    }

    //async generateNewBlock() {
    //    const newBlock: IBlock = await this.node.generateNewBlock();
    //
    //    if (newBlock) {
    //        const message = this._messageFactory.create(P2PMessageType.RESPONSE_LATEST_BLOCK(newBlock));
    //        this._p2p.broadcast(message);
    //    }
    //
    //    return {
    //        success: !!newBlock,
    //        data: (newBlock) ? newBlock : null
    //    }
    //}
}