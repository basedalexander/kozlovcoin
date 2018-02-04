import { P2PMessageHandlerFactory } from "./p2p-message-handler-factory";

export function P2PMessageHandler(type) {
    return function (target) {
        P2PMessageHandlerFactory.register(type, target);
    }
}