import { Injectable } from 'container-ioc';

import nodeConfig from '../../config/node-config.json';

@Injectable()
export class NodeConfiguration {
    constructor() {
        this.minderAddress = nodeConfig.minerAddress;
    }
}