import { Module } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module';
import { NodeModule } from '../node/node.module';
import { WalletManager } from './wallet.manager';
import { WalletController } from './api/wallet.controller';
import { KeyGeneratorService } from './key-generator/key-generator.service';

@Module({
    imports: [
        TransactionModule,
        NodeModule
    ],
    components: [
        WalletManager,
        KeyGeneratorService
    ],
    controllers: [
        WalletController
    ]
})
export class WalletModule {

}