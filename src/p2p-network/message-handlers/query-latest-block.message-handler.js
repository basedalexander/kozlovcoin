import { Injectable, Inject } from 'container-ioc';

import { MessageHandler } from "../message-handler.decorator";
import { EMessageType } from "../message-type.enum";
import { P2PNetwork } from "../p2p-network";
import { Blockchain} from "../../application/blockchain/blockchain";

@Injectable([Blockchain, P2PNetwork])
@MessageHandler(EMessageType.QUERY_LATEST_BLOCK)
export class QueryLatestBlockMessageHandler {
    constructor(
        @Inject(Blockchain) blockchain,
        @Inject(P2PNetwork) p2p
    ) {
        this._blockchain = blockchain;
        this._p2p = p2p;
    }

    execute(ws) {
        const latestBlock = this._blockchain.getLatestBlock();

        const message = {
            type: EMessageType.RESPONSE_LATEST_BLOCK,
            data: latestBlock
        };

        this._p2p.sendMessage(ws, message);
    }
}