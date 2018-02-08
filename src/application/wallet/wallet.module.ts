import { Module } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module';
import { NodeModule } from '../node/node.module';
import { WalletManager } from './wallet.manager';
import { KeyGeneratorService } from './key-generator/key-generator.service';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
    imports: [
        TransactionModule,
        NodeModule,
        CryptoModule
    ],
    components: [
        WalletManager
    ],
    exports: [
        WalletManager
    ]
})
export class WalletModule {

}