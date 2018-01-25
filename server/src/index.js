import { Server } from './server/server';
import serverConfig from '../config/server-config.json';
import { node } from './application/node';
import { logger } from './system//logger/logger';

const server = new Server(serverConfig, node, logger);
server.start();