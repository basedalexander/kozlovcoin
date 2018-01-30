import {QueryLatestBlockP2PMessage} from "./query-latest-block.p2p-message";
import {QueryAllBlocksP2PMessage} from "./query-all-blocks.p2p-message";
import {ResponseLatestBlockP2PMessage} from "./response-latest-block.p2p-message";
import {NullP2PMessage} from "./null.p2p-message";

export const p2pMessages = [
    QueryLatestBlockP2PMessage,
    QueryAllBlocksP2PMessage,
    ResponseLatestBlockP2PMessage,
    NullP2PMessage
];