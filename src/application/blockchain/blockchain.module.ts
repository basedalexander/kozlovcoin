import { Module } from '@nestjs/common';

import { StorageModule } from '../storage/storage.module';
import { Blockchain } from './blockchain';
import { SystemModule } from '../../system/system.module';

@Module({
    imports: [
        StorageModule,
        SystemModule
    ],
    components: [
        Blockchain
    ],
    exports: [
        Blockchain
    ]
})
export class BlockchainModule {

}