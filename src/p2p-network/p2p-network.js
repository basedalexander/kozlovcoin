import { Injectable, Inject } from 'container-ioc';
import WebSocket from 'ws';

import { P2PMessageType } from "./messages/p2p-message-type";
import { TLogger } from "../system/logger/logger";
import { Node } from '../application/node';
import { P2PMessageHandlerFactory } from "./messages/message-handler/p2p-message-handler-factory";
import {Configuration} from "../bootstrap/configuration";
import {P2PMessageFactory} from "./messages/message/p2p-message-factory";

@Injectable([
    Node,
    TLogger,
    P2PMessageFactory,
    P2PMessageHandlerFactory,
    Configuration
])
export class P2PNetwork {
    constructor(
        @Inject(Node) node,
        @Inject(TLogger) logger,
        @Inject(P2PMessageFactory) messageFactory,
        @Inject(P2PMessageHandlerFactory) messageHandlerFactory,
        @Inject(Configuration) config,
    ) {
        this._node = node;
        this._logger = logger;
        this._messageFactory = messageFactory;
        this._messageHandlerFactory = messageHandlerFactory;
        this._config = config.p2p;

        this._initializePeers();

        this._node.blockMined.subscribe((block) => {
            this.broadcast(this._createMessage(P2PMessageType.RESPONSE_LATEST_BLOCK, block));
        });
    }

    start() {
        this._server = new WebSocket.Server({port: this._config.port});

        this._server.on('connection', (ws, req) => {

            this._socket = ws;
            this._host = req.headers['host'];

            this._initConnection(ws);
        });

        this._logger.log(`P2P Network is listening on port: ${this._config.port}`);
    }

    broadcast(message) {
        this._sockets.forEach(socket => this.sendMessage(socket, message));
    }

    sendMessage(ws, message) {
        const serializedMessage = JSON.stringify(message);

        this._logger.log(`P2P ${this._config.port} ---> ${this._getSocketUrl(ws)}: ${serializedMessage}`);
        ws.send(serializedMessage);
    }

    getPeers() {
        return this._sockets.map(socket => socket.url);
    }

    _getSocketUrl(socket) {
        return (socket === this._socket) ? `ws://${this._host}` : socket.url;
    }


    _initializePeers() {
        this._initialPeers = this._config.peers;
        this._sockets = [];

        this._initialPeers.forEach(peer => {
            const ws = new WebSocket(peer);

            ws.on('open', () => this._initConnection(ws));
            ws.on('error', () => {
                this._logger.error(`ws connection failed : ${this._getSocketUrl(ws)}`);
            });
        });
    }

    _initConnection(ws) {
        this._sockets.push(ws);

        this._setupMessageHandler(ws);
        this._setupErrorHandler(ws);

        if (ws !== this._socket) {
            this.sendMessage(ws, this._createMessage(P2PMessageType.QUERY_LATEST_BLOCK));
        }
    }

    _createMessage(type, message) {
        return this._messageFactory.create(type, message);
    }

    _setupMessageHandler(ws) {
        ws.on('message', (data) => {
            this._logger.log(`P2P ${this._config.port} <--- ${this._getSocketUrl(ws)}: ${data}`);

            const message = JSON.parse(data);

            const handler = this._messageHandlerFactory.create(message.type);
            handler.execute(ws, message);
        });
    }

    _setupErrorHandler(ws) {
        ws.on('close', (err) => this._closePeerConnection(ws, err));
        ws.on('error', (err) => this._closePeerConnection(ws, err));
    }

    _closePeerConnection(ws, err) {
        this._logger.log(`P2P ERROR connection failed: ${this._getSocketUrl(ws)} ERROR_CODE: ${err}`);
        const index = this._sockets.indexOf(ws);
        this._sockets.splice(index, 1);
    }
}