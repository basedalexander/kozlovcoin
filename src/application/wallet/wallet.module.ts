import { Module } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module';
import { NodeModule } from '../node/node.module';
import { WalletManager } from './wallet.manager';
import { CryptoModule } from '../crypto/crypto.module';
import { SystemModule } from '../../system/system.module';

@Module({
    imports: [
        TransactionModule,
        NodeModule,
        CryptoModule,
        SystemModule
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