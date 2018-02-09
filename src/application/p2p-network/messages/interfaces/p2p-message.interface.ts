import { P2PMessageType } from './p2p-message-type';

export interface IP2PMessage {
    type: P2PMessageType;
    data: any;
}