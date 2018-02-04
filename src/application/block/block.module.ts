import { Module } from '@nestjs/common';

import { CryptoModule } from '../crypto/crypto.module';
import { BlockFactory } from './block-factory';
import { BlockUtilsService } from './block-utils.service';

@Module({
    imports: [
        CryptoModule
    ],
    components: [
        BlockFactory,
        BlockUtilsService
    ],
    exports: [
        BlockFactory
    ]
})
export class BlockModule {

}