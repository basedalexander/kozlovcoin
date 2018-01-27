import { Server } from './server/server';
import serverConfig from '../config/server-config.json';
import { node } from './application/node';
import { logger } from './system//logger/logger';
import { P2PNetwork } from "./server/p2p-network/p2p-network";
import { MessageHandlerFactory } from "./server/p2p-network/message-handler-factory";

// TODO integrate IoC container

export const p2pNetwork = new P2PNetwork(node, logger, MessageHandlerFactory);

p2pNetwork.start();

export const server = new Server(serverConfig, node, logger);
server.start();