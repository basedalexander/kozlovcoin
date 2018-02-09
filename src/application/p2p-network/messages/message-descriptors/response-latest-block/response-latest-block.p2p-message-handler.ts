import { Component, Inject } from '@nestjs/common';
import { Node } from '../../../../node/node';
import { P2PNetwork } from '../../../p2p-network';
import { ILogger, TLogger } from '../../../../../system/logger/interfaces/logger.interface';
import { IP2PMessageHandler } from '../../interfaces/message-handler.interface';
import { IP2PMessage } from '../../interfaces/p2p-message.interface';
import { P2PMessageType } from '../../interfaces/p2p-message-type';
import { P2PMessageFactory } from '../../p2p-message-factory';

@Component()
export class ResponseLatestBlockP2PMessageHandler implements IP2PMessageHandler {
    constructor(
        private node: Node,
        private p2p: P2PNetwork,
        @Inject(TLogger) private logger: ILogger,
        private messageFactory: P2PMessageFactory
    ) {
    }

    async execute(ws, message: IP2PMessage): Promise<void> {
        const receivedLatestBlock = message.data;
        const heldLatestBlock = await this.node.getLastBlock();

        if (receivedLatestBlock.index > heldLatestBlock.index) {

            let msg: IP2PMessage;

            if (receivedLatestBlock.previousBlockHash === heldLatestBlock.hash) {
                // todo
                // await this.node.addBlock(receivedLatestBlock);

                msg = this.messageFactory.createMessage(
                    P2PMessageType.RESPONSE_LATEST_BLOCK,
                    receivedLatestBlock
                );

                this.p2p.broadcast(msg);
            } else {
                msg = this.messageFactory.createMessage(
                    P2PMessageType.QUERY_ALL_BLOCKS
                );
            }

            this.p2p.broadcast(msg);
        }
    }
}