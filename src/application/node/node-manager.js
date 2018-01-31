import {Injectable} from "container-ioc";
import {P2PNetwork} from "../../p2p-network/p2p-network";
import {Node} from "./node";
import {P2PMessageFactory} from "../../p2p-network/messages/message/p2p-message-factory";
import {P2PMessageType} from "../../p2p-network/messages/p2p-message-type";

@Injectable([
    P2PNetwork,
    Node,
    P2PMessageFactory
])
export class NodeManager {
    constructor(
        @Inject(P2PNetwork) p2p,
        @Inject(Node) node,
        @Inject(P2PMessageFactory) messageFactory
    ) {
        this._p2p = p2p;
        this._node = node;
        this._messageFactory = messageFactory;
    }

    async generateNewBlock() {
        const newBlock = await this._node.generateNewBlock();

        if (newBlock) {
            const message = this._messageFactory.create(P2PMessageType.RESPONSE_LATEST_BLOCK(newBlock));
            this._p2p.broadcast(message);
        }

        return {
            success: !!newBlock,
            data: (newBlock) ? newBlock : null
        }
    }
}