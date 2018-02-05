import {QueryLatestBlockP2PMessage} from "./query-latest-block.p2p-message";
import {QueryAllBlocksP2PMessage} from "./query-all-blocks.p2p-message";
import {ResponseLatestBlockP2PMessage} from "./response-latest-block.p2p-message";
import {NullP2PMessage} from "./null.p2p-message";
import {ResponseTxPoolP2PMessage} from "./response-tx-pool.message";
import {QueryTxPoolP2PMessage} from "./query-tx-pool.message";

export const p2pMessages = [
    QueryLatestBlockP2PMessage,
    ResponseLatestBlockP2PMessage,

    QueryAllBlocksP2PMessage,

    QueryTxPoolP2PMessage,
    ResponseTxPoolP2PMessage,

    NullP2PMessage
];