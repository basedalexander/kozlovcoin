import {QueryLatestBlockMessageHandler} from "./query-latest-block.message-handler";
import {QueryAllBlocksMessageHandler} from "./query-all-blocks.message-handler";
import {NullMessageHandler} from "./null.mesasge-handler";

export const messageHandlers = [
    QueryLatestBlockMessageHandler,
    QueryAllBlocksMessageHandler,
    NullMessageHandler
];