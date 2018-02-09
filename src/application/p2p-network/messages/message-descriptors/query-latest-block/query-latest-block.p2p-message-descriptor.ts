import { P2PMessageDescriptor } from '../p2p-message-descriptor-decorator';
import { P2PMessageType } from '../../interfaces/p2p-message-type';
import { QueryLatestBlockP2PMessageHandler } from './query-latest-block.p2p-message-handler';

@P2PMessageDescriptor({
    type: P2PMessageType.QUERY_LATEST_BLOCK,
    handler: QueryLatestBlockP2PMessageHandler
})
export class QueryLatestBlockP2pMessageDescriptor {}