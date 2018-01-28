import WebSocket from 'ws';
import { Injectable, Inject } from 'container-ioc';

import { EMessageType } from "./message-type.enum";
import { TLogger } from "../system/logger/logger";
import { Node } from '../application/node';
import { MessageHandlerFactory } from "./message-handler-factory";
import { P2PNetworkConfiguration } from "./p2p-network-configuration";

@Injectable([Node, TLogger, MessageHandlerFactory, P2PNetworkConfiguration])
export class P2PNetwork {
    constructor(
        @Inject(Node) node,
        @Inject(TLogger) logger,
        @Inject(MessageHandlerFactory) messageHandlerFactory,
        @Inject(P2PNetworkConfiguration) config,
    ) {
        this._node = node;
        this._logger = logger;
        this._messageHandlerFactory = messageHandlerFactory;
        this._config = config;

        this._initializePeers();

        this._node.blockMined.subscribe((block) => {
            this.broadcast({
                type: EMessageType.RESPONSE_LATEST_BLOCK,
                data: block
            });
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
            this.sendMessage(ws, {
                type: EMessageType.QUERY_LATEST_BLOCK,
                data: null
            });
        }
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