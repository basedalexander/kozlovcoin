import { Injectable, Inject } from 'container-ioc';

import { P2PMessageHandler } from "./p2p-message-handler.decorator";
import { P2PMessageType } from "../p2p-message-type";
import { P2PNetwork } from "../../p2p-network";
import { Node } from "../../../application/node";
import {TLogger} from "../../../system/logger/logger";
import {P2PMessageFactory} from "../message/p2p-message-factory";

@Injectable([
    Node,
    P2PNetwork,
    TLogger,
    P2PMessageFactory
])
@P2PMessageHandler(P2PMessageType.QUERY_TX_POOL)
export class QueryTxPoolP2PMessageHandler {
    constructor(
        @Inject(Node) node,
        @Inject(P2PNetwork) p2p,
        @Inject(TLogger) logger,
        @Inject(P2PMessageFactory) messageFactory
    ) {
        this._node = node;
        this._p2p = p2p;
        this._logger = logger;
        this._messageFactory = messageFactory;
    }

    async execute(ws) {
        const latestBlock = await this._node.getTxPool();

        const message = this._messageFactory.create(P2PMessageType.RESPONSE_LATEST_BLOCK);

        this._p2p.sendMessage(ws, message);
    }
}