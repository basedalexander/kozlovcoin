import {QueryLatestBlockP2PMessageHandler} from "./query-latest-block.p2p-message-handler";
import {QueryAllBlocksP2PMessageHandler} from "./query-all-blocks.p2p-message-handler";
import {NullP2PMessageHandler} from "./null.p2p-message-handler";
import {ResponseLatestBlockP2PMessageHandler} from "./response-latest-block.p2p-message-handler";

export const p2pMessageHandlers = [
    QueryLatestBlockP2PMessageHandler,
    QueryAllBlocksP2PMessageHandler,
    ResponseLatestBlockP2PMessageHandler,
    NullP2PMessageHandler
];