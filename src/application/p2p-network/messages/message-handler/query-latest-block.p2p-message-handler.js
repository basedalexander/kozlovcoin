import { Injectable, Inject } from 'container-ioc';

import { P2PMessageHandler } from "./p2p-message-handler.decorator";
import { P2PMessageType } from "../p2p-message-type";
import { P2PNetwork } from "../../p2p-network";
import { Blockchain} from "../../../application/blockchain/blockchain";

@Injectable([Blockchain, P2PNetwork])
@P2PMessageHandler(P2PMessageType.QUERY_LATEST_BLOCK)
export class QueryLatestBlockP2PMessageHandler {
    constructor(
        @Inject(Blockchain) blockchain,
        @Inject(P2PNetwork) p2p
    ) {
        this._blockchain = blockchain;
        this._p2p = p2p;
    }

    async execute(ws) {
        const latestBlock = await this._blockchain.getLatestBlock();

        const message = {
            type: P2PMessageType.RESPONSE_LATEST_BLOCK,
            data: latestBlock
        };

        this._p2p.sendMessage(ws, message);
    }
}