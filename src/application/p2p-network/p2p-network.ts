import { Component, Inject } from '@nestjs/common';
import * as WebSocket from 'ws';
import { Node } from '../node/node';
import { ILogger, TLogger } from '../../system/logger/interfaces/logger.interface';
import { Configuration } from '../../system/configuration';
import { P2PMessageFactory } from './messages/p2p-message-factory';
import { P2PMessageType } from './messages/interfaces/p2p-message-type';
import { IP2PMessage } from './messages/interfaces/p2p-message.interface';
import { IP2PMessageHandler } from './messages/interfaces/message-handler.interface';

export interface IClientInfo {
    address: string;
    socket: WebSocket;
}

@Component()
export class P2PNetwork {
    private server: WebSocket.Server;
    private initialPeers: string[] = [];

    private clients: IClientInfo[] = [];
    
    constructor(
        private node: Node,
        @Inject(TLogger) private logger: ILogger,
        private config: Configuration,
        private messageFactory: P2PMessageFactory 
    ) {

    }

    async start(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server = new WebSocket.Server({ port: this.config.p2p.port });
            this.logger.log(`P2P Network is listening on port: ${this.config.p2p.port}`);

            this.initializePeers();

            resolve();

            this.server.on('connection', (ws, req) => {
                this.initConnection(ws, req.connection.remoteAddress);
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
                }
            });
        });
    }

    broadcast(message) {
        this.clients.forEach(client => this.sendMessage(client.socket, message));
    }

    sendMessage(ws, message) {
        const serializedMessage = JSON.stringify(message);

        this.logger.log(`P2P ${this.config.p2p.port} ---> ${this.getSocketUrl(ws)}: ${serializedMessage}`);
        ws.send(serializedMessage);
    }

    getPeers() {
        return this.clients.map(socket => socket.address);
    }

    async addPeer(url): Promise<void> {
        this.initializePeer(url);
    }

   private getSocketUrl(socket) {
        return socket.url;
    }

   private initializePeers(): void {
        this.initialPeers = this.config.p2p.peers;
        this.clients = [];

        this.initialPeers.forEach(peer => {
            this.initializePeer(peer);
        });
    }

   private initializePeer(address: string): void {
        const ws = new WebSocket(address);

        ws.on('open', () => this.initConnection(ws, address));
        ws.on('error', () => {
            this.logger.error(`ws connection failed : ${this.getSocketUrl(ws)}`);
        });
    }

   private initConnection(ws, address): void {
        this.clients.push({
            address,
            socket: ws
        });

        this.setupMessageHandler(ws);
        this.setupErrorHandler(ws);

        this.sendInitialMessages(ws);
    }

    private sendInitialMessages(ws: WebSocket): void {
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
            this.logger.log(`P2P ${this.config.p2p.port} <--- ${this.getSocketUrl(ws)}: ${data}`);

            const message: IP2PMessage = JSON.parse(data);
            const handler: IP2PMessageHandler = this.messageFactory.createHandler(message.type);
            await handler.execute(ws, message);
        });
    }

   private setupErrorHandler(ws): void {
        ws.on('close', (err) => this.closePeerConnection(ws, err));
        ws.on('error', (err) => this.closePeerConnection(ws, err));
    }

   private closePeerConnection(ws, err): void {
        this.logger.log(`P2P ERROR connection failed: ${this.getSocketUrl(ws)} ERROR_CODE: ${err}`);
        const index = this.clients.indexOf(ws);
        this.clients.splice(index, 1);
    }
}