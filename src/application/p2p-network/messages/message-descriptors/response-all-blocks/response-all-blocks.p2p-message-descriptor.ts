import { P2PMessageDescriptor } from '../p2p-message-descriptor-decorator';
import { P2PMessageType } from '../../interfaces/p2p-message-type';
import { ResponseAllBlocksP2pMessageHandler } from './response-all-blocks.p2p-message-handler';

@P2PMessageDescriptor({
    type: P2PMessageType.RESPONSE_ALL_BLOCKS,
    handler: ResponseAllBlocksP2pMessageHandler
})
export class ResponseAllBlocksP2pMessageDescriptor {}