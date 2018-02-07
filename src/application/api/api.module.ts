import { Module } from '@nestjs/common';
import { NodeController } from './controllers/node-controller/node.controller';
import { NodeModule } from '../node/node.module';
import { WalletController } from './controllers/wallet-controller/wallet.controller';
import { WalletModule } from '../wallet/wallet.module';

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
export class ApiModule {

}