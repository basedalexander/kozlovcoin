import { Component, Inject } from '@nestjs/common';
import * as WebSocket from 'ws';
import { Node } from '../node/node';
import { ILogger, TLogger } from '../../system/logger/interfaces/logger.interface';
import { Configuration } from '../../system/configuration';
import { P2PMessageFactory } from './messages/p2p-message-factory';
import { P2PMessageType } from './messages/interfaces/p2p-message-type';
import { IP2PMessage } from './messages/interfaces/p2p-message.interface';
import { IP2PMessageHandler } from './messages/interfaces/message-handler.interface';
import { IBlock } from '../block/block.interface';

@Component()
export class P2PNetwork {
    private server: WebSocket.Server;
    private peers: WebSocket[] = [];

    constructor(
        private node: Node,
        @Inject(TLogger) private logger: ILogger,
        private config: Configuration,
        private messageFactory: P2PMessageFactory
    ) {

        this.node.blockMined.subscribe((newBlock: IBlock) => {
            const message: IP2PMessage =
                this.messageFactory.createMessage(P2PMessageType.RESPONSE_LAST_BLOCK, newBlock);

            this.broadcast(message);
        });

        this.node.txPoolUpdate.subscribe((pool) => {
            const message: IP2PMessage =
                this.messageFactory.createMessage(P2PMessageType.RESPONSE_TX_POOL, pool);

            this.broadcast(message);
        });
    }

    async start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server = new WebSocket.Server({ port: this.config.p2p.port });
            this.logger.log(`P2P Network is listening on port: ${this.config.p2p.port}`);

            this.initializePeers();

            resolve();

            this.server.on('connection', (ws, req) => {
                this.setupEstablishedConnection(ws);
            });
        });
    }

    async close(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server.close(error => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve();
                    this.logger.info(`P2P ${this.config.p2p.host}:${this.config.p2p.port} Websocket server is closed`);
                }
            });
        });
    }

    public broadcast(message) {
        this.peers.forEach(peerSocket => this.sendMessage(peerSocket, message));
    }

    public sendMessage(ws, message) {
        const serializedMessage = JSON.stringify(message);

        this.logger.log(`P2P ${this.config.p2p.port} ---> ${this.getSocketUrl(ws)}: ${P2PMessageType[message.type]} ${JSON.stringify(message.data)}`);
        ws.send(serializedMessage);
    }

    public getPeers() {
        return this.peers.map(socket => socket.url);
    }

    public async addPeer(url): Promise<void> {
        this.connectToPeer(url);
    }

    private getSocketUrl(socket) {
        return socket.url;
    }

    private initializePeers(): void {
        this.config.p2p.peers.forEach(peer => {
            this.connectToPeer(peer);
        });
    }

    private connectToPeer(address: string): void {
        const ws = new WebSocket(address);

        ws.on('open', () => {
            this.setupEstablishedConnection(ws);
        });
        ws.on('error', () => {
            this.logger.error(`ws connection failed : ${this.getSocketUrl(ws)}`);
        });
    }

    private setupEstablishedConnection(ws): void {
        this.peers.push(ws);

        this.setupMessageHandler(ws);
        this.setupErrorHandler(ws);

        this.sendInitialMessagesToConnectedPeer(ws);
    }

    private sendInitialMessagesToConnectedPeer(ws: WebSocket): void {
        this.sendMessage(
            ws,
            this.createMessage(P2PMessageType.QUERY_LATEST_BLOCK)
        );

        this.sendMessage(
            ws,
            this.createMessage(P2PMessageType.QUERY_TX_POOL)
        );
    }

    private createMessage(type: P2PMessageType, message?: string): IP2PMessage {
        return this.messageFactory.createMessage(type, message);
    }

    private setupMessageHandler(ws): void {
        ws.on('message', async (data) => {
            const message: IP2PMessage = JSON.parse(data);

            this.logger.log(`P2P ${this.config.p2p.port} <--- ${this.getSocketUrl(ws)}: ${P2PMessageType[message.type]} ${JSON.stringify(message.data)}`);

            const handler: IP2PMessageHandler = this.messageFactory.createHandler(message.type);
            handler.execute(ws, message);
        });
    }

    private setupErrorHandler(ws): void {
        ws.on('close', (err) => {
            this.closePeerConnection(ws, err);
        });
        ws.on('error', (err) => {
            this.closePeerConnection(ws, err);
        });
    }

    private closePeerConnection(ws, err): void {
        this.logger.log(`P2P ERROR connection failed: ${this.getSocketUrl(ws)} ERROR_CODE: ${err}`);
        const index = this.peers.indexOf(ws);
        this.peers.splice(index, 1);
    }
}