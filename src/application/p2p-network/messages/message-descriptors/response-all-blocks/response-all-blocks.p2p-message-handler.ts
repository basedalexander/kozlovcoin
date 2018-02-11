import { Component, Inject } from '@nestjs/common';
import { Node } from '../../../../node/node';
import { P2PNetwork } from '../../../p2p-network';
import { ILogger, TLogger } from '../../../../../system/logger/interfaces/logger.interface';
import { IP2PMessageHandler } from '../../interfaces/message-handler.interface';
import { IP2PMessage } from '../../interfaces/p2p-message.interface';
import { P2PMessageFactory } from '../../p2p-message-factory';

@Component()
export class ResponseAllBlocksP2pMessageHandler implements IP2PMessageHandler {
    constructor(
        private node: Node,
        private p2p: P2PNetwork,
        @Inject(TLogger) private logger: ILogger,
        private messageFactory: P2PMessageFactory
    ) {
    }

    async execute(ws, message: IP2PMessage): Promise<void> {
        await this.node.handleRecievedChain(message.data);
    }
}