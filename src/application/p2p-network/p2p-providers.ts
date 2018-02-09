import { P2PMessageFactory } from './messages/p2p-message-factory';
import { P2PNetwork } from './p2p-network';
import { P2P_MESSAGE_HANDLERS } from './messages/p2p-message-handlers';
import './messages/message-descriptors';

export const P2P_PROVIDERS = [
    P2PNetwork,
    P2PMessageFactory,
    ...P2P_MESSAGE_HANDLERS
];