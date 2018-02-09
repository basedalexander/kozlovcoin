import { P2PMessageType } from '../interfaces/p2p-message-type';
import { P2PMessageFactory } from '../p2p-message-factory';

export interface IP2PMessageMetadata {
    type: P2PMessageType;
    handler: any;
}

export function P2PMessageDescriptor(md: IP2PMessageMetadata) {
    return (target) => {
        P2PMessageFactory.register(md);
    };
}