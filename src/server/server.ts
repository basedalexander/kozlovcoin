import { INestApplication } from '@nestjs/common';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { IServer } from './server.interface';
import { Express } from 'express';
import { NestFactoryStatic } from '@nestjs/core';
import { ApplicationModule } from '../application/application.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Configuration } from '../system/configuration';
import { ILogger, TLogger } from '../system/logger/interfaces/logger.interface';
import { LoggerModule } from '../system/logger/lib/logger.module';
import { ValidationPipe } from '../application/api/validation/validation-pipe';
import { HttpExceptionFilter } from '../application/api/exceptions/http-exception-handler';
import { P2PNetwork } from '../application/p2p-network/p2p-network';
import { NodeModule } from '../application/node/node.module';
import { SystemModule } from '../system/system.module';
import { Node } from '../application/node/node';

export class Server implements IServer {
    public config: Configuration;

    private app: Express;
    private nestApp: INestApplication;
    private p2p: P2PNetwork;
    private node: Node;

    private logger: ILogger;

    public async init() {
        this.app = express();
        this.setupMiddleware(this.app);

        const appFactory = new NestFactoryStatic();

        this.nestApp = await appFactory.create(ApplicationModule, this.app);
        this.nestApp.useGlobalPipes(new ValidationPipe());
        this.nestApp.useGlobalFilters(new HttpExceptionFilter());

        this.config = this.nestApp.select(SystemModule).get(Configuration);
        this.logger = this.nestApp.select(LoggerModule).get(TLogger);
        this.p2p = this.nestApp.select(NodeModule).get(P2PNetwork);

        this.setupApiDocs(this.nestApp);

        this.node = this.nestApp.select(NodeModule).get(Node);
    }

    public async start(): Promise<void> {
        await this.node.init();

        await this.p2p.start();

        await this.nestApp.listen(this.config.server.port);

        this.logger.info(`Server is listening on ${this.config.server.host}:${this.config.server.port}`);
    }

    public async stop(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {

            await this.p2p.close();

            const httpServer = this.nestApp.getHttpServer();

            httpServer.close(() => {
                this.nestApp.close();
                this.logger.info(`Server ${this.config.server.host}:${this.config.server.port} is closed`);
                resolve();
            });
        });
    }

    public getHttpServerInstance(): Express {
        return this.nestApp.getHttpServer();
    }

    private setupMiddleware(app) {
        app.use(cors());
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
    }

    private setupApiDocs(nestApp: INestApplication): void {
        const options = new DocumentBuilder()
            .setTitle('Kozlovcoin blockchain API Docs')
            .setDescription('')
            .setVersion('1.0')
            .build();

        const document = SwaggerModule.createDocument(nestApp, options);
        SwaggerModule.setup(this.config.server.apiDocsRoute, nestApp, document);
    }
}