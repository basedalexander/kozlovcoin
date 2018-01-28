import {NullMessageHandler} from "./message-handlers/null.mesasge-handler";
import { Injectable, Inject, Container } from 'container-ioc';

@Injectable([Container])
export class MessageHandlerFactory {
    constructor(
        @Inject(Container) container
    ) {
        this._container = container;
    }
    static registry = new Map();

    static register(type, handlerConstructor) {
        MessageHandlerFactory.registry.set(type, handlerConstructor);
    }

    create(type) {
        let handlerConstructor = MessageHandlerFactory.registry.get(type);

        if (!handlerConstructor) {
           handlerConstructor = NullMessageHandler;
        }

        return this._container.resolve(handlerConstructor);
    }
}