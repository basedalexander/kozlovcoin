import { Injectable, Inject } from 'container-ioc';

import { MessageHandler } from "../message-handler.decorator";
import { EMessageType } from "../message-type.enum";
import { P2PNetwork } from "../p2p-network";
import { Node } from '../../../application/node';

@Injectable([Node, P2PNetwork])
@MessageHandler(EMessageType.QUERY_ALL_BLOCKS)
export class QueryAllBlocksMessageHandler {
    constructor(
        @Inject(Node) node,
        @Inject(P2PNetwork) p2p
    ) {
        this._node = node;
        this._p2p = p2p;
    }

    execute(ws) {
        const blocks = this._node.getAllBlocks();

        const message = {
            type: EMessageType.RESPONSE_ALL_BLOCKS,
            data: JSON.stringify(blocks)
        };

        this._p2p.sendMessage(ws, message);
    }
}