import { INestApplication } from '@nestjs/common';

import * as express from 'express';
import * as bodyParser from 'body-parser';

import { IServer } from './server.interface';
import { Express } from 'express';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from '../application/application.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IServerConfiguration } from '../configuration/configuration.interface';

export class Server implements IServer {
    private app: Express;
    private nestApp: INestApplication;

    constructor(private config: IServerConfiguration) {

    }

    public async init() {
        this.app = express();
        this.setupMiddleware(this.app);

        this.nestApp = await NestFactory.create(ApplicationModule, this.app);
        this.setupApiDocs(this.nestApp);
    }

    async start(): Promise<void> {
        await this.nestApp.listen(this.config.port, this.config.host);
    }

    async stop(): Promise<void> {
        this.nestApp.close();
    }

    public getHttpServerInstance(): Express {
        return this.nestApp.getHttpServer();
    }

    private setupMiddleware(app) {
        app.use(bodyParser.json({limit: '50mb'}));
        app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
    }

    private setupApiDocs(nestApp: INestApplication): void {
        const options = new DocumentBuilder()
            .setTitle('Cats example')
            .setDescription('The cats API description')
            .setVersion('1.0')
            .addTag('cats')
            .build();

        const document = SwaggerModule.createDocument(nestApp, options);
        SwaggerModule.setup('/api', nestApp, document);
    }
}