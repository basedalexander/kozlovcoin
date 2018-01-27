import { MessageHandlerFactory } from "./message-handler-factory";

export function MessageHandler(type) {
    return function (target) {
        MessageHandlerFactory.register(type, target);
    }
}