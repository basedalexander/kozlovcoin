import { Injectable, Inject } from 'container-ioc';
import { Environment } from "../system/environment";
import { Configuration } from "../system/configuration";

@Injectable([Environment, Configuration])
export class P2PNetworkConfiguration {
    constructor(
        @Inject(Environment) env,
        @Inject(Configuration) config
    ) {
        this.env = env;
        this.config = config.p2p;

        this.host = env.p2pHost ? env.p2pHost : this.config.host;
        this.port = env.p2pPort ? env.p2pPort : this.config.port;
        this.peers = env.p2pPeers ? env.p2pPeers.split(',') : [];
    }
}