import { P2PMessageDescriptor } from '../p2p-message-descriptor-decorator';
import { P2PMessageType } from '../../interfaces/p2p-message-type';
import { ResponseTxPoolP2PMessageHandler } from './response-tx-pool.p2p-message-handler';

@P2PMessageDescriptor({
    type: P2PMessageType.RESPONSE_TX_POOL,
    handler: ResponseTxPoolP2PMessageHandler
})
export class ResponseTxPoolP2pMessageDescriptor {}