import { Module } from '@nestjs/common';

import { CryptoModule } from '../crypto/crypto.module';
import { BlockFactory } from './block-factory';
import { BlockUtilsService } from './block-utils.service';
import { BlockValidatorService } from './block-validator.service';
import { UnspentTransactionOutputsModule } from '../unspent-transaction-outputs/unspent-transaction-outputs.module';

@Module({
    imports: [
        CryptoModule,
        UnspentTransactionOutputsModule
    ],
    components: [
        BlockFactory,
        BlockUtilsService,
        BlockValidatorService
    ],
    exports: [
        BlockFactory,
        BlockValidatorService
    ]
})
export class BlockModule {

}