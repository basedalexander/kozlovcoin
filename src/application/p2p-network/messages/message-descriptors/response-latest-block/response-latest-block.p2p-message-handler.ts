import { Component, Inject } from '@nestjs/common';
import { Node } from '../../../../node/node';
import { P2PNetwork } from '../../../p2p-network';
import { ILogger, TLogger } from '../../../../../system/logger/interfaces/logger.interface';
import { IP2PMessageHandler } from '../../interfaces/message-handler.interface';
import { IP2PMessage } from '../../interfaces/p2p-message.interface';
import { IBlock } from '../../../../block/block.interface';
import { NodeManager } from '../../../../node/node-manager';

@Component()
export class ResponseLatestBlockP2PMessageHandler implements IP2PMessageHandler {
    constructor(private node: Node,
                private p2p: P2PNetwork,
                @Inject(TLogger) private logger: ILogger,
                private nodeManager: NodeManager
    ) {
    }

    async execute(ws, message: IP2PMessage): Promise<void> {
        const block: IBlock = message.data;

        await this.nodeManager.handleReceivedLastBlock(block, ws);
    }
}