import { Injectable, Inject } from 'container-ioc';

import { P2PMessageType } from "../p2p-message-type";
import { P2PMessage } from "./p2p-message.decorator";

@Injectable()
@P2PMessage(P2PMessageType.QUERY_ALL_BLOCKS)
export class QueryAllBlocksP2PMessage {
    execute() {
        return {
            type: P2PMessageType.QUERY_ALL_BLOCKS,
            data: null
        };
    }
}