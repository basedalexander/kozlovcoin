import { Component, Inject } from '@nestjs/common';

import { ILogger, TLogger } from '../../../../../system/logger/interfaces/logger.interface';
import { IP2PMessageHandler } from '../../interfaces/message-handler.interface';
import { IP2PMessage } from '../../interfaces/p2p-message.interface';

@Component()
export class NullP2pMessageHandler implements IP2PMessageHandler {
    constructor(
        @Inject(TLogger) private logger: ILogger
    ) {}

    async execute(message: IP2PMessage): Promise<void> {
        this.logger.info(`Handling unknown message : ${JSON.stringify(message)}`);
    }
}