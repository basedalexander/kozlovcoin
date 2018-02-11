import { ResponseTxPoolP2PMessageHandler } from './message-descriptors/response-tx-pool/response-tx-pool.p2p-message-handler';
import { NullP2pMessageHandler } from './message-descriptors/null/null-p2p-message-handler';
import { QueryAllBlocksP2PMessageHandler } from './message-descriptors/query-all-blocks/query-all-blocks.p2p-message-handler';
import { QueryLatestBlockP2PMessageHandler } from './message-descriptors/query-latest-block/query-latest-block.p2p-message-handler';
import { ResponseLatestBlockP2PMessageHandler } from './message-descriptors/response-latest-block/response-latest-block.p2p-message-handler';
import { QueryTxPoolP2PMessageHandler } from './message-descriptors/query-tx-pool/query-tx-pool.p2p-message-handler';
import { ResponseAllBlocksP2pMessageHandler } from './message-descriptors/response-all-blocks/response-all-blocks.p2p-message-handler';

export const P2P_MESSAGE_HANDLERS = [
    ResponseTxPoolP2PMessageHandler,
    NullP2pMessageHandler,
    QueryAllBlocksP2PMessageHandler,
    QueryLatestBlockP2PMessageHandler,
    QueryTxPoolP2PMessageHandler,
    ResponseLatestBlockP2PMessageHandler,
    ResponseAllBlocksP2pMessageHandler
];