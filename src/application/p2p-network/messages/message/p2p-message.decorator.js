import {P2PMessageFactory} from "./p2p-message-factory";

export function P2PMessage(type) {
    return function (target) {
        P2PMessageFactory.register(type, target);
    }
}