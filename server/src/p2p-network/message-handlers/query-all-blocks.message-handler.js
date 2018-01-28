import { Injectable, Inject } from 'container-ioc';

import { MessageHandler } from "../message-handler.decorator";
import { EMessageType } from "../message-type.enum";
import { P2PNetwork } from "../p2p-network";
import { Node } from '../../application/node';
import {Blockchain} from "../../application/blockchain/blockchain";

@Injectable([Blockchain, P2PNetwork])
@MessageHandler(EMessageType.QUERY_ALL_BLOCKS)
export class QueryAllBlocksMessageHandler {
    constructor(
        @Inject(Blockchain) blockchain,
        @Inject(P2PNetwork) p2p
    ) {
        this._blockchain = blockchain;
        this._p2p = p2p;
    }

    execute(ws) {
        const blocks = this._blockchain.getBlocks();

        const message = {
            type: EMessageType.RESPONSE_ALL_BLOCKS,
            data: blocks
        };

        this._p2p.sendMessage(ws, message);
    }
}