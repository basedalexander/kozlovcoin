import { Injectable, Inject } from 'container-ioc';

import { MessageHandler } from "../message-handler.decorator";
import { EMessageType } from "../message-type.enum";
import { Node } from '../../../application/node';
import {P2PNetwork} from "../p2p-network";
import {TLogger} from "../../../system/logger/logger";

@Injectable([Node, P2PNetwork, TLogger])
@MessageHandler(EMessageType.RESPONSE_LATEST_BLOCK)
export class ResponseLatestBlockMessageHandler {
    constructor(
        @Inject(Node) node,
        @Inject(P2PNetwork) p2p,
        @Inject(TLogger) logger,
    ) {
        this._node = node;
        this._p2p = p2p;
        this._logger = logger;
    }

    execute(ws, message) {
        const receivedLatestBlock = message.data;
        this._logger.log(`Received latest block: ${JSON.stringify(receivedLatestBlock)}`);

        const heldLatestBlock = this._node.getLatestBlock();

        if (receivedLatestBlock.index > heldLatestBlock.index) {
            if (receivedLatestBlock.previousBlockHash !== heldLatestBlock.hash) {
                this._logger.log(`Looks like peer's blockchain is longer, requesting all blocks ...`);
                this._requestAllBlocks(ws);
                return;
            }

            const blockValid = this._node.validateBlock(receivedLatestBlock, heldLatestBlock);

            if (blockValid) {
                this._node.addBlock(receivedLatestBlock);
            }
        }

        const msg = {
            type: EMessageType.QUERY_ALL_BLOCKS,
            data: null
        };

        this._p2p.sendMessage(ws, msg);
    }

    _requestAllBlocks(ws) {
        const message = {
            type: EMessageType.QUERY_ALL_BLOCKS,
            data: null
        };

        this._p2p.sendMessage(ws, message);
    }
}