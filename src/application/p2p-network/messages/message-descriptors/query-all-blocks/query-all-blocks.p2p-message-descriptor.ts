import { P2PMessageDescriptor } from '../p2p-message-descriptor-decorator';
import { P2PMessageType } from '../../interfaces/p2p-message-type';
import { QueryAllBlocksP2PMessageHandler } from './query-all-blocks.p2p-message-handler';

@P2PMessageDescriptor({
    type: P2PMessageType.QUERY_ALL_BLOCKS,
    handler: QueryAllBlocksP2PMessageHandler
})
export class QueryAllBlocksP2pMessageDescriptor {}