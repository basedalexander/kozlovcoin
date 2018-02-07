import { Module } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module';
import { NodeModule } from '../node/node.module';
import { WalletManager } from './wallet.manager';
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
    exports: [
        WalletManager
    ]
})
export class WalletModule {

}