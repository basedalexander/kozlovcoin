import { Injectable, Inject } from 'container-ioc';
import serverConfig from '../../config/server-config.json';

@Injectable()
export class ServerConfiguration {
    constructor() {
        this.port = serverConfig.port;
        this.host = serverConfig.host;
    }
}