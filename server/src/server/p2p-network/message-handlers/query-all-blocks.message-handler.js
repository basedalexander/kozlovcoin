import { MessageHandler } from "../message-handler.decorator";
import { EMessageType } from "../message-type.enum";

@MessageHandler(EMessageType.QUERY_ALL_BLOCKS)
export class QueryAllBlocksMessageHandler {
    constructor(context) {
        this._context = context;
    }

    execute(ws) {
        const blocks = this._context.node.getAllBlocks();

        const response = {
            type: EMessageType.RESPONSE_ALL_BLOCKS,
            data: JSON.stringify(blocks)
        };

        const serializedResponse = JSON.stringify(response);

        ws.send(serializedResponse);
    }
}