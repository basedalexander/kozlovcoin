import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from '../system/logger/lib/logger.middleware';
import { SystemModule } from '../system/system.module';
import { NodeModule } from './node/node.module';
import { ApiModule } from './api/api.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
    imports: [
        SystemModule,
        NodeModule,
        ApiModule,
        WalletModule
    ]
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}