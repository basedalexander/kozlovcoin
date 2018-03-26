import { Module } from '@nestjs/common';

import { NodeModule } from '../../node/node.module';
import { WalletModule } from '../../wallet/wallet.module';
import { NodeController } from './node/node.controller';
import { WalletController } from './wallet/wallet.controller';

@Module({
    imports: [
        NodeModule,
        WalletModule
    ],
    controllers: [
        NodeController,
        WalletController
    ]
})
export class ApiV1Module {

}