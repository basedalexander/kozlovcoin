import {NullMessageHandler} from "./message-handlers/null.mesasge-handler";

export class MessageHandlerFactory {
    static registry = new Map();

    static register(type, handlerConstructor) {
        MessageHandlerFactory.registry.set(type, handlerConstructor);
    }

    static create(type, context) {
        const handlerConstructor = MessageHandlerFactory.registry.get(type);

        if (handlerConstructor) {
            return new handlerConstructor(context);
        } else {
            return new NullMessageHandler(context);
        }
    }
}