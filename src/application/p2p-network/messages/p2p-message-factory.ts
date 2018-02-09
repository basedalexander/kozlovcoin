import { Component, INestApplicationContext } from '@nestjs/common';
import { IP2PMessageMetadata } from './message-descriptors/p2p-message-descriptor-decorator';
import { IP2PMessage } from './interfaces/p2p-message.interface';
import { P2PMessageType } from './interfaces/p2p-message-type';
import { IP2PMessageHandler, IP2PMessageHandlerConstructor } from './interfaces/message-handler.interface';
import { NullP2pMessageHandler } from './message-descriptors/null/null-p2p-message-handler';
import { Configuration } from '../../../system/configuration';

@Component()
export class P2PMessageFactory {
    public static register(md: IP2PMessageMetadata) {
        P2PMessageFactory.registry.set(md.type, md);
    }

    private static registry: Map<P2PMessageType, IP2PMessageMetadata> = new Map();

    private container: INestApplicationContext;

    public setContainer(container: INestApplicationContext): void {
        this.container = container;
    }

    public createMessage(type: P2PMessageType, message?: any): IP2PMessage {
        return {
            type,
            data: (message ? message : null)
        };
    }

    public createHandler(type: P2PMessageType): IP2PMessageHandler {
        const handlerMd: IP2PMessageMetadata = P2PMessageFactory.registry.get(type);
        const handlerConstructor: IP2PMessageHandlerConstructor = handlerMd.handler;

        const handlerInstance: IP2PMessageHandler = this.resolveInstance(handlerConstructor);

        if (!handlerConstructor) {
            return this.resolveInstance(NullP2pMessageHandler);
        }

        return handlerInstance;
    }

    private resolveInstance(type: any): any {
        if (!this.container) {
            throw new Error('P2PMessageFactory: container is not found');
        }

        return this.container.get(type);
    }
}