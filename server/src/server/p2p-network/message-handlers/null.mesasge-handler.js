export class NullMessageHandler {
    constructor(context) {
        this._context = context;
    }

    execute(ws, message) {
        this._context.logger.warn(`Unhandled incoming message: ${message}`);
    }
}