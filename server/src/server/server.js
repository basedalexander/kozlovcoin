import express from 'express';
import { Injectable, Inject } from 'container-ioc';
import bodyParser from 'body-parser';

import { Swagger } from './swagger';
import {ServerConfiguration} from "./server-configuration";
import { TLogger } from "../system/logger/logger";
import { Node } from '../application/node';

@Injectable([ServerConfiguration, Node, TLogger])
export class Server {
    constructor(
        @Inject(ServerConfiguration) config,
        @Inject(Node) node,
        @Inject(TLogger) logger
    ) {
        this._config = config;
        this.node = node;
        this.logger = logger;
        this.swagger = new Swagger(logger);

        this._init();
    }

    start() {
        this.app.listen(this._config.port, () => {
            this.logger.log(`Server is listening on port ${this._config.port}`)
        });
    }

    getExpress() {
        return this.app;
    }

    _init() {
        this.app = express();
        this._setupMiddleware(this.app);
        this._setupRouting(this.app);
    }

    _setupMiddleware(app) {
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        this.swagger.init(this.app);
    }

    _setupRouting(app) {
        // app.get('/', (req, res) => res.send('Hey'));

        app.post('/transaction', (req, res) => {
            this.node.addTransaction(req.body);
            res.end();
        });

        app.get('/mine', (req, res) => {
            const minedBlock = this.node.mine();

            res.json({
                index: minedBlock.index,
                timeStamp: minedBlock.timeStamp,
                data: minedBlock.data,
                hash: minedBlock.hash
            });
        });

        app.get('/blocks', (req, res) => {
            const chain = this.node.getBlocks();
            res.json(chain);
        });
    }
}