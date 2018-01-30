import { Injectable } from "container-ioc";
import { Environment } from "../system/environment";
import * as path from 'path';

@Injectable([
    Environment
])
export class Configuration {
    constructor(
        @Inject(Environment) env
    ) {
        this.env = env;
        this.config = require(`../../config/${env.config ? env.config : 'local'}-config.json`);

        this.rootPath = path.join(__dirname, '../../', this.config.rootPath);

        this.server = {
            host: env.serverHost ? env.serverHost : this.config.server.host,
            port: env.serverPort ?  env.serverPort : this.config.server.port
        };

        this.p2p = {
            host: env.p2pHost ? env.p2pHost : this.config.p2p.host,
            port: env.p2pPort ? env.p2pPort : this.config.p2p.port,
            peers: env.p2pPeers ? env.p2pPeers.split(',') : []
        };

        this.node = {
            minerAddress: this.config.node.minerAddress
        };

        this.wallet = {
            storageDir: path.join(this.rootPath, this.config.wallet.storageDir)
        };
    }
}