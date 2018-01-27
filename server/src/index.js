import { Server } from './server/server';
import { P2PNetwork } from "./p2p-network/p2p-network";
import {setupContainer} from "./bootstrap/setup-container";

const container = setupContainer();

export const p2pNetwork = container.resolve(P2PNetwork);

p2pNetwork.start();

export const server = container.resolve(Server);
server.start();