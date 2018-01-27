import { MessageHandler } from "../message-handler.decorator";
import { EMessageType } from "../message-type.enum";

@MessageHandler(EMessageType.QUERY_LATEST_BLOCK)
export class QueryLatestBlockMessageHandler {
    constructor(context) {
        this._context = context;
    }

    execute(ws) {
        const latestBlock = this._context.node.getLatestBlock();

        const response = {
            type: EMessageType.RESPONSE_LATEST_BLOCK,
            data: JSON.stringify(latestBlock)
        };

        const serializedResponse = JSON.stringify(response);

        ws.send(serializedResponse);
    }
}