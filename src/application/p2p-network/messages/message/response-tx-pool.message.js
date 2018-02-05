import { Injectable, Inject } from 'container-ioc';

import { P2PMessageType } from "../p2p-message-type";
import { P2PMessage } from "./p2p-message.decorator";

@Injectable()
@P2PMessage(P2PMessageType.RESPONSE_TX_POOL)
export class ResponseTxPoolP2PMessage {
    execute(message) {
        return {
            type: P2PMessageType.RESPONSE_TX_POOL,
            data: message
        };
    }
}