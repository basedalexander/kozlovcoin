import { Injectable, Inject } from 'container-ioc';

import { MessageHandler } from "../message-handler.decorator";
import { EMessageType } from "../message-type.enum";
import { Node } from '../../../application/node';
import {P2PNetwork} from "../p2p-network";


@Injectable([Node, P2PNetwork])
@MessageHandler(EMessageType.QUERY_LATEST_BLOCK)
export class QueryLatestBlockMessageHandler {
    constructor(
        @Inject(Node) node,
        @Inject(P2PNetwork) p2p
    ) {
        this._node = node;
        this._p2p = p2p;
    }

    execute(ws) {
        const latestBlock = this._node.getLatestBlock();

        const message = {
            type: EMessageType.RESPONSE_LATEST_BLOCK,
            data: latestBlock
        };

        this._p2p.sendMessage(ws, message);
    }
}