/* tslint:disable:no-string-literal */

import { Component } from '@nestjs/common';
import { IEnvironment } from './environment.interface';

@Component()
export class Environment implements IEnvironment {
    public config = process.env['ENV_CONFIG'];
    public mode = process.env['ENV_MODE'];
    public serverHost = process.env['SERVER_HOST'];
    public serverPort = process.env['SERVER_PORT'] ? +(process.env['SERVER_PORT']) : null;
    public p2pHost = process.env['P2P_HOST'];
    public p2pPort = process.env['P2P_PORT'] ? +(process.env['P2P_PORT']) : null;
    public p2pPeers = process.env['P2P_PEERS'];
}