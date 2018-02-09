import { ResponseTxPoolP2pMessageDescriptor } from './message-descriptors/response-tx-pool/response-tx-pool.p2p-message-descriptor';
import { QueryTxPoolP2pMessageDescriptor } from './message-descriptors/query-tx-pool/query-tx-pool.p2p-message-descriptor';
import { QueryAllBlocksP2pMessageDescriptor } from './message-descriptors/query-all-blocks/query-all-blocks.p2p-message-descriptor';
import { QueryLatestBlockP2pMessageDescriptor } from './message-descriptors/query-latest-block/query-latest-block.p2p-message-descriptor';
import { ResponseLatestBlockP2pMessageDescriptor } from './message-descriptors/response-latest-block/response-latest-block.p2p-message-descriptor';

export const MESSAGE_DESCRIPTORS = [
    ResponseTxPoolP2pMessageDescriptor,
    QueryTxPoolP2pMessageDescriptor,
    QueryAllBlocksP2pMessageDescriptor,
    QueryLatestBlockP2pMessageDescriptor,
    ResponseLatestBlockP2pMessageDescriptor
];