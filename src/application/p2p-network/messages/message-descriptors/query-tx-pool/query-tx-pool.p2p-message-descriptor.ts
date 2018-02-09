import { P2PMessageDescriptor } from '../p2p-message-descriptor-decorator';
import { P2PMessageType } from '../../interfaces/p2p-message-type';
import { QueryTxPoolP2PMessageHandler } from './query-tx-pool.p2p-message-handler';

@P2PMessageDescriptor({
    type: P2PMessageType.QUERY_TX_POOL,
    handler: QueryTxPoolP2PMessageHandler
})
export class QueryTxPoolP2pMessageDescriptor {}