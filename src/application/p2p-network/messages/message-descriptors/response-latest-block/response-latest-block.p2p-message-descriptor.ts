import { P2PMessageDescriptor } from '../p2p-message-descriptor-decorator';
import { P2PMessageType } from '../../interfaces/p2p-message-type';
import { ResponseLatestBlockP2PMessageHandler } from './response-latest-block.p2p-message-handler';

@P2PMessageDescriptor({
    type: P2PMessageType.RESPONSE_LAST_BLOCK,
    handler: ResponseLatestBlockP2PMessageHandler
})
export class ResponseLatestBlockP2pMessageDescriptor {}