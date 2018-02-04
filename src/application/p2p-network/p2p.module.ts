import { Module } from '@nestjs/common';
import { P2PNetwork } from './p2p-network';
import { NodeModule } from '../node/node.module';

@Module({
    imports: [
        NodeModule
    ],
    components: [
        P2PNetwork
    ],
    exports: [
        P2PNetwork
    ]
})
export class P2pModule {

}