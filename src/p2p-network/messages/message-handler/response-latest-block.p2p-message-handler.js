import { Injectable, Inject } from 'container-ioc';

import { P2PMessageHandler } from "./p2p-message-handler.decorator";
import { P2PMessageType } from "../p2p-message-type";
import { P2PNetwork} from "../../p2p-network";
import {TLogger} from "../../../system/logger/logger";
import { Blockchain } from "../../../application/blockchain/blockchain";

@Injectable([Blockchain, P2PNetwork, TLogger])
@P2PMessageHandler(P2PMessageType.RESPONSE_LATEST_BLOCK)
export class ResponseLatestBlockP2PMessageHandler {
    constructor(
        @Inject(Blockchain) blockchain,
        @Inject(P2PNetwork) p2p,
        @Inject(TLogger) logger
    ) {
        this._blockchain = blockchain;
        this._p2p = p2p;
        this._logger = logger;
    }

    execute(ws, message) {
        const receivedLatestBlock = message.data;
        const heldLatestBlock = this._blockchain.getLatestBlock();


        if (receivedLatestBlock.index > heldLatestBlock.index) {
            if (receivedLatestBlock.previousBlockHash === heldLatestBlock.hash) {
                this._blockchain.addBlock(receivedLatestBlock);
                this._p2p.broadcast({
                    type: P2PMessageType.RESPONSE_LATEST_BLOCK,
                    data: receivedLatestBlock
                });
            }
            else {
                this._p2p.sendMessage(ws, {
                    type: P2PMessageType.QUERY_ALL_BLOCKS
                })
            }
        }
    }
}