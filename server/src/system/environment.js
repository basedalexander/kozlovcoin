import { Injectable, Inject } from 'container-ioc';

@Injectable()
export class Environment {
    constructor() {
        this.config = process.env['ENV_CONFIG'];

        this.serverHost = process.env['SERVER_HOST'];
        this.serverPort = process.env['SERVER_PORT'] ? +(process.env['SERVER_PORT']) : null;

        this.p2pHost = process.env['P2P_HOST'];
        this.p2pPort = process.env['P2P_PORT'] ? +(process.env['P2P_PORT']) : null;
        this.p2pPeers = process.env['P2P_PEERS'];
    }
}