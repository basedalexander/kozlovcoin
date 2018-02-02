import { Injectable, Inject } from 'container-ioc';

import { P2PMessageHandler } from "./p2p-message-handler.decorator";
import { P2PMessageType } from "../p2p-message-type";
import { P2PNetwork} from "../../p2p-network";
import { TLogger } from "../../../system/logger/logger";
import { Node } from "../../../application/node/node";

@Injectable([
    Node,
    P2PNetwork,
    TLogger
])
@P2PMessageHandler(P2PMessageType.RESPONSE_TX_POOL)
export class ResponseTxPoolP2PMessageHandler {
    constructor(
        @Inject(Node) node,
        @Inject(P2PNetwork) p2p,
        @Inject(TLogger) logger
    ) {
        this._node = node;
        this._p2p = p2p;
        this._logger = logger;
    }

    execute(ws, message) {
        const receivedTransactions = message.data;

        if (receivedTransactions === null) {
            this._logger.log('invalid transaction received: %s', JSON.stringify(message.data));
            return;
        }

        receivedTransactions.forEach(async transaction => {
            await this._node.addTx(transaction);
        });
    }
}