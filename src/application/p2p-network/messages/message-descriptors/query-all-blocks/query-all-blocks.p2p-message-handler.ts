import { Component } from '@nestjs/common';
import { Node } from '../../../../node/node';
import { P2PNetwork } from '../../../p2p-network';
import { IP2PMessageHandler } from '../../interfaces/message-handler.interface';
import { P2PMessageType } from '../../interfaces/p2p-message-type';
import { P2PMessageFactory } from '../../p2p-message-factory';

@Component()
export class QueryAllBlocksP2PMessageHandler implements IP2PMessageHandler {
    constructor(
        private node: Node,
        private p2p: P2PNetwork,
        private messageFactory: P2PMessageFactory
    ) {
    }

    async execute(ws) {
        const blocks = await this.node.getBlocks();

        const message = this.messageFactory.createMessage(
            P2PMessageType.RESPONSE_ALL_BLOCKS,
            blocks
        );

        this.p2p.sendMessage(ws, message);
    }
}