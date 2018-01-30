import {NullP2PMessageHandler} from "../message-handler/null.p2p-message-handler";
import { Injectable, Inject, Container } from 'container-ioc';

@Injectable([Container])
export class P2PMessageFactory {
    constructor(
        @Inject(Container) container
    ) {
        this._container = container;
    }
    static registry = new Map();

    static register(type, handlerConstructor) {
        P2PMessageFactory.registry.set(type, handlerConstructor);
    }

    create(type, message) {
        let handlerConstructor = P2PMessageFactory.registry.get(type);

        if (!handlerConstructor) {
            handlerConstructor = NullP2PMessageHandler;
        }

        const messagefactory = this._container.resolve(handlerConstructor);

        return messagefactory.execute(message);
    }
}