import { Module } from '@nestjs/common';
import { NodeController } from './controllers/node.controller';
import { NodeModule } from '../node/node.module';

@Module({
    imports: [
        NodeModule
    ],
    controllers: [
        NodeController
    ]
})
export class ApiModule {

}