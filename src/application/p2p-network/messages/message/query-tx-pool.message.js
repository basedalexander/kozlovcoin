import { Injectable } from 'container-ioc';

import { P2PMessageType } from "../p2p-message-type";
import { P2PMessage } from "./p2p-message.decorator";

@Injectable()
@P2PMessage(P2PMessageType.QUERY_TX_POOL)
export class QueryTxPoolP2PMessage {
    execute() {
        return {
            type: P2PMessageType.QUERY_TX_POOL,
            data: null
        };
    }
}