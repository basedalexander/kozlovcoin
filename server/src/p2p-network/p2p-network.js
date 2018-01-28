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
                type: EMessageType.NEW_BLOCK_MINED,
                data: block
            });
        });
    }

    start() {
        this._server = new WebSocket.Server({port: this._config.port});
        this._server.on('connection', ws => this._initConnection(ws));
        this._logger.log(`Listening websocket p2p port on: ${this._config.port}`);
    }

    broadcast(message) {
        this._sockets.forEach(socket => this.sendMessage(socket, message));
    }

    sendMessage(ws, message) {
        const serializedMessage = JSON.stringify(message);
        ws.send(serializedMessage);
    }

    getPeers() {
        return this._sockets.map(socket => socket.url);
    }

    _initializePeers() {
        this._initialPeers = this._config.peers;
        this._sockets = [];

        this._initialPeers.forEach(peer => {
            const ws = new WebSocket(peer);
            this._initConnection(ws);
        });
    }

    _initConnection(ws) {
        ws.on('open', () => {
            this._sockets.push(ws);
            this._setupMessageHandler(ws);
            this._setupErrorHandler(ws);

            this.sendMessage(ws, {
                type: EMessageType.QUERY_LATEST_BLOCK, // todo encapsulate message creation
                data: null
            })
        });

        ws.on('error', () => {
            this._logger.error(`ws connection failed : ${ws.url}`)
        });
    }

    _createContext() {
        return {
            p2pNetwork: this,
            initialPeers: this._initialPeers,
            sockets: this._sockets,
            node: this._node,
            logger: this._logger
        }
    }

    _setupMessageHandler(ws) {
        ws.on('message', (data) => {
            this._logger.log(`Received message: ${data}`);

            const message = JSON.parse(data);

            const handler = this._messageHandlerFactory.create(message.type);
            handler.execute(ws, message);
        });
    }

    _setupErrorHandler(ws) {
        ws.on('close', () => this._closePeerConnection(ws));
        ws.on('error', () => this._closePeerConnection(ws));
    }

    _closePeerConnection(ws) {
        this.logger.log('Connection with peer failed, url: ' + ws.url);
        const index = this._sockets.indexOf(ws);
        this._sockets.splice(index, 1);
    }
}