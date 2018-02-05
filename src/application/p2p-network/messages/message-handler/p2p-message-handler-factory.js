import {NullP2PMessageHandler} from "./null.p2p-message-handler";
import { Injectable, Inject, Container } from 'container-ioc';

@Injectable([Container])
export class P2PMessageHandlerFactory {
    constructor(
        @Inject(Container) container
    ) {
        this._container = container;
    }
    static registry = new Map();

    static register(type, handlerConstructor) {
        P2PMessageHandlerFactory.registry.set(type, handlerConstructor);
    }

    create(type) {
        let handlerConstructor = P2PMessageHandlerFactory.registry.get(type);

        if (!handlerConstructor) {
           handlerConstructor = NullP2PMessageHandler;
        }

        return this._container.resolve(handlerConstructor);
    }
}