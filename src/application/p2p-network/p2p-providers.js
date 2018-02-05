import {P2PNetwork} from "./p2p-network";
import {P2PMessageHandlerFactory} from "./messages/message-handler/p2p-message-handler-factory";
import {p2pMessageHandlers} from "./messages/message-handler/p2p-message-handlers";
import {p2pMessages} from "./messages/message/p2p-messages";
import {P2PMessageFactory} from "./messages/message/p2p-message-factory";

export const P2P_PROVIDERS = [
    P2PNetwork,
    P2PMessageFactory,
    P2PMessageHandlerFactory,
    ...p2pMessages,
    ...p2pMessageHandlers
];