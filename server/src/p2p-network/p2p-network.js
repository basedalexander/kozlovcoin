import WebSocket from 'ws';
import { Injectable, Inject } from 'container-ioc';

import { EMessageType } from "./message-type.enum";
import './message-handlers/message-handlers';
import { TLogger } from "../system/logger/logger";
import { Node } from '../application/node';
import { MessageHandlerFactory } from "./message-handler-factory";

@Injectable([Node, TLogger, MessageHandlerFactory])
export class P2PNetwork {
    constructor(
        @Inject(Node) node,
        @Inject(TLogger) logger,
        @Inject(MessageHandlerFactory) messageHandlerFactory
    ) {
        this._node = node;
        this._logger = logger;
        this._messageHandlerFactory = messageHandlerFactory;

        this._initializePeers();

        this._node.blockMined.subscribe((block) => {
            this.broadcast({
                type: EMessageType.NEW_BLOCK_MINED,
                data: block
            });
        });
    }

    start() {
        this._server = new WebSocket.Server({port: 6001}); // todo read from config
        this._server.on('connection', ws => this._initConnection(ws));
        this._logger.log('listening websocket p2p port on: ' + 6001);
    }

    broadcast(message) {
        this._sockets.forEach(socket => this.sendMessage(socket, message));
    }

    sendMessage(ws, message) {
        const serializedMessage = JSON.stringify(message);
        ws.send(serializedMessage);
    }

    _initializePeers() {
        this._initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : []; // todo read from config
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
            this._log.error('connection failed')
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

            const handler = this._messageHandlerFactory.create(message.type, this._createContext());
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