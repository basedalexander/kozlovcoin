import express from 'express';
import { Injectable, Inject } from 'container-ioc';
import bodyParser from 'body-parser';

import { Swagger } from './swagger';
import { TLogger } from "../system/logger/logger";
import { Node } from '../application/node';
import { P2PNetwork } from "../p2p-network/p2p-network";
import { TRequestLogger } from "../system/logger/request-logger";
import { controllers } from "../application/api/controllers/index";
import { ControllerFactory } from "../application/api/controller-factory";
import { Configuration } from "../bootstrap/configuration";

@Injectable([
    Configuration,
    Node,
    TLogger,
    P2PNetwork,
    TRequestLogger,
    ControllerFactory
])
export class Server {
    constructor(
        @Inject(Configuration) config,
        @Inject(Node) node,
        @Inject(TLogger) logger,
        @Inject(P2PNetwork) p2p,
        @Inject(TRequestLogger) requestLogger,
        @Inject(ControllerFactory) controllerFactory
    ) {
        this._config = config.server;
        this._node = node;
        this._logger = logger;
        this._swagger = new Swagger(logger);
        this._p2p = p2p;
        this._requestLogger = requestLogger;
        this._controllerFactory = controllerFactory;

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
        this._setupControllers(this.app);
    }

    _setupMiddleware(app) {
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(this._requestLogger);
    }

    _setupControllers(app) {
        controllers.forEach(controller => {
            const data = this._controllerFactory.create(controller);

            const path = data.path;
            const router = data.controller.router;
            app.use(path, router);
        });
    }
}