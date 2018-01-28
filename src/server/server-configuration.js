import { Injectable, Inject } from 'container-ioc';
import { Environment } from "../system/environment";
import { Configuration } from "../system/configuration";

@Injectable([Environment, Configuration])
export class ServerConfiguration {
    constructor(
        @Inject(Environment) env,
        @Inject(Configuration) config
    ) {
        this.env = env;
        this.config = config.server;

        this.host = env.serverHost ? env.serverHost : this.config.host;
        this.port = env.serverPort ?  env.serverPort : this.config.port;
    }
}