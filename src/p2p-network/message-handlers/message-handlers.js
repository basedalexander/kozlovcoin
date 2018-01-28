import {QueryLatestBlockMessageHandler} from "./query-latest-block.message-handler";
import {QueryAllBlocksMessageHandler} from "./query-all-blocks.message-handler";
import {NullMessageHandler} from "./null.mesasge-handler";
import {ResponseLatestBlockMessageHandler} from "./response-latest-block.message-handler";

export const messageHandlers = [
    QueryLatestBlockMessageHandler,
    QueryAllBlocksMessageHandler,
    ResponseLatestBlockMessageHandler,
    NullMessageHandler
];