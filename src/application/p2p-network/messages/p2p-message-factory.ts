import { Component, INestApplicationContext } from '@nestjs/common';
import { IP2PMessageMetadata } from './message-descriptors/p2p-message-descriptor-decorator';
import { IP2PMessage } from './interfaces/p2p-message.interface';
import { P2PMessageType } from './interfaces/p2p-message-type';
import { IP2PMessageHandler, IP2PMessageHandlerConstructor } from './interfaces/message-handler.interface';
import { NullP2pMessageHandler } from './message-descriptors/null/null-p2p-message-handler';

@Component()
export class P2PMessageFactory {
    public static container: INestApplicationContext;

    public static register(md: IP2PMessageMetadata) {
        P2PMessageFactory.registry.set(md.type, md);
    }

    private static registry: Map<P2PMessageType, IP2PMessageMetadata> = new Map();

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
        if (!P2PMessageFactory.container) {
            throw new Error('P2PMessageFactory: container is not found');
        }

        return P2PMessageFactory.container.get(type);
    }
}