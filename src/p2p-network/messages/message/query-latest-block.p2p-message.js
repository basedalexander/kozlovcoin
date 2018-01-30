import { Injectable, Inject } from 'container-ioc';

import { P2PMessageType } from "../p2p-message-type";
import { P2PMessage } from "./p2p-message.decorator";

@Injectable()
@P2PMessage(P2PMessageType.QUERY_LATEST_BLOCK)
export class QueryLatestBlockP2PMessage {
    execute() {
        return {
            type: P2PMessageType.QUERY_LATEST_BLOCK,
            data: null
        };
    }
}