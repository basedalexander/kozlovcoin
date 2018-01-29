import express from 'express';
import { Injectable, Inject } from 'container-ioc';
import bodyParser from 'body-parser';

import { Swagger } from './swagger';
import {ServerConfiguration} from "./server-configuration";
import { TLogger } from "../system/logger/logger";
import { Node } from '../application/node';
import {P2PNetwork} from "../p2p-network/p2p-network";
import {TRequestLogger} from "../system/logger/request-logger";

@Injectable([
    ServerConfiguration,
    Node,
    TLogger,
    P2PNetwork,
    TRequestLogger
])
export class Server {
    constructor(
        @Inject(ServerConfiguration) config,
        @Inject(Node) node,
        @Inject(TLogger) logger,
        @Inject(P2PNetwork) p2p,
        @Inject(TRequestLogger) requestLogger,
    ) {
        this._config = config;
        this._node = node;
        this._logger = logger;
        this._swagger = new Swagger(logger);
        this._p2p = p2p;
        this._requestLogger = requestLogger;

        this._init();
    }

    start() {
        this.app.listen(this._config.port, (err) => {
            if (err) {
                this._logger.error(err);
            } else {
                this._logger.log(`Server is listening on port ${this._config.port}`)
            }
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

        app.use(this._requestLogger);

        // this._swagger.init(this.app);
    }

    // todo integrate actual controllers
    _setupRouting(app) {
        app.post('/transaction', (req, res) => {
            this._node.addTransaction(req.body);
            res.end();
        });

        app.get('/mine', (req, res) => {
            const minedBlock = this._node.mine();

            res.json({
                index: minedBlock.index,
                timeStamp: minedBlock.timeStamp,
                data: minedBlock.data,
                hash: minedBlock.hash
            });
        });

        app.get('/blocks', (req, res) => {
            const chain = this._node.getBlocks();
            res.json(chain);
        });

        app.get('/peers', (req, res) => {
            const peers = this._p2p.getPeers();
            res.json(peers);
        });

        app.post('/mineTransaction', (req, res) => {
            const address = req.body.address;
            const amount = req.body.amount;
            const resp = {}; // todo add transaction to the transaction pool and mine a new block
            res.send(resp);
        });
    }
}