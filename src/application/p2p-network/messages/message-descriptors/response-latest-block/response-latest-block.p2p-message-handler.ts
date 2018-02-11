import { Component, Inject } from '@nestjs/common';
import { Node } from '../../../../node/node';
import { P2PNetwork } from '../../../p2p-network';
import { ILogger, TLogger } from '../../../../../system/logger/interfaces/logger.interface';
import { IP2PMessageHandler } from '../../interfaces/message-handler.interface';
import { IP2PMessage } from '../../interfaces/p2p-message.interface';
import { P2PMessageType } from '../../interfaces/p2p-message-type';
import { P2PMessageFactory } from '../../p2p-message-factory';
import { BlockValidatorService } from '../../../../block/block-validator.service';

@Component()
export class ResponseLatestBlockP2PMessageHandler implements IP2PMessageHandler {
    constructor(private node: Node,
                private p2p: P2PNetwork,
                @Inject(TLogger) private logger: ILogger,
                private messageFactory: P2PMessageFactory,
                private blockValidator: BlockValidatorService) {
    }

    async execute(ws, message: IP2PMessage): Promise<void> {
        const receivedLatestBlock = message.data;

        if (!this.blockValidator.validateStructure(receivedLatestBlock)) {
            this.logger.error('Received last block has invalid structure, ignoring');
            return;
        }

        const heldLatestBlock = await this.node.getLastBlock();

        if (receivedLatestBlock.index > heldLatestBlock.index) {
            if (receivedLatestBlock.previousBlockHash === heldLatestBlock.hash) {
                await this.node.addNewBlock(receivedLatestBlock);

                const msg = this.messageFactory.createMessage(
                    P2PMessageType.RESPONSE_LAST_BLOCK,
                    receivedLatestBlock
                );
                this.p2p.broadcast(msg);
            } else {
                this.logger.error(`Node: Adding new block, received block ${receivedLatestBlock.hash} either higher then our last block or not valid`);

                const msg = this.messageFactory.createMessage(
                    P2PMessageType.QUERY_ALL_BLOCKS
                );
                this.p2p.sendMessage(ws, msg);
            }
        }
    }
}