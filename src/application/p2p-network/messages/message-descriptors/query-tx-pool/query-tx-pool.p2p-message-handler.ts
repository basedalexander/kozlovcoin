import { Component, Inject } from '@nestjs/common';
import { Node } from '../../../../node/node';
import { P2PNetwork } from '../../../p2p-network';
import { ILogger, TLogger } from '../../../../../system/logger/interfaces/logger.interface';
import { IP2PMessageHandler } from '../../interfaces/message-handler.interface';
import { P2PMessageType } from '../../interfaces/p2p-message-type';
import { P2PMessageFactory } from '../../p2p-message-factory';

@Component()
export class QueryTxPoolP2PMessageHandler implements IP2PMessageHandler {
    constructor(
        private node: Node,
        private p2p: P2PNetwork,
        @Inject(TLogger) private logger: ILogger,
        private messageFactory: P2PMessageFactory
    ) {
    }

    async execute(ws): Promise<void> {
        const pool = await this.node.getTxPool();

        const message = this.messageFactory.createMessage(P2PMessageType.RESPONSE_TX_POOL, pool);

        this.p2p.sendMessage(ws, message);
    }
}