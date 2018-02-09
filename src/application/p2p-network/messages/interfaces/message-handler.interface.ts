import { IP2PMessage } from './p2p-message.interface';

export interface IP2PMessageHandler {
    execute(socket: any, message: IP2PMessage): Promise<any>;
}

export interface IP2PMessageHandlerConstructor {
    new(): IP2PMessageHandler;
}