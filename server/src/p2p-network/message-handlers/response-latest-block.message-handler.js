import { Injectable, Inject } from 'container-ioc';

import { MessageHandler } from "../message-handler.decorator";
import { EMessageType } from "../message-type.enum";
import { P2PNetwork} from "../p2p-network";
import {TLogger} from "../../system/logger/logger";
import { Blockchain } from "../../application/blockchain/blockchain";

@Injectable([Blockchain, P2PNetwork, TLogger])
@MessageHandler(EMessageType.RESPONSE_LATEST_BLOCK)
export class ResponseLatestBlockMessageHandler {
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
                    type: EMessageType.RESPONSE_LATEST_BLOCK,
                    data: receivedLatestBlock
                });
            }
            else {
                this._p2p.sendMessage(ws, {
                    type: EMessageType.QUERY_ALL_BLOCKS
                })
            }
        }
    }
}