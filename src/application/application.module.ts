import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from '../system/logger/lib/logger.middleware';
import { SystemModule } from '../system/system.module';

@Module({
    imports: [
       SystemModule
    ]
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes( { path: '*', method: RequestMethod.ALL } );
    }
}