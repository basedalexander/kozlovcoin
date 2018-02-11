import { Component, Inject } from '@nestjs/common';
import { Node } from '../../../../node/node';
import { P2PNetwork } from '../../../p2p-network';
import { ILogger, TLogger } from '../../../../../system/logger/interfaces/logger.interface';
import { IP2PMessageHandler } from '../../interfaces/message-handler.interface';
import { IP2PMessage } from '../../interfaces/p2p-message.interface';

@Component()
export class ResponseTxPoolP2PMessageHandler implements IP2PMessageHandler {
    constructor(
        private node: Node,
        private p2p: P2PNetwork,
        @Inject(TLogger) private logger: ILogger
    ) {
    }

    async execute(ws, message: IP2PMessage): Promise<void> {
        const receivedTransactions = message.data;

        if (receivedTransactions === null) {
            this.logger.error('invalid transaction received: %s', JSON.stringify(message.data));
            return;
        }

        for (const tx of receivedTransactions) {
            try {
                await this.node.addTransaction(tx);
            } catch (e) {
                this.logger.error(`Invalid tx received ${tx.id}`);
            }
        }
    }
}