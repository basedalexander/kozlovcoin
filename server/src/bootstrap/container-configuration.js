import {P2PNetwork} from "../server/p2p-network/p2p-network";
import {Server} from "../server/server";
import {ServerConfiguration} from "../server/server-configuration";
import {Swagger} from "../server/swagger";
import {Node } from '../application/node';
import {Blockchain} from "../application/blockchain/blockchain";
import {NodeConfiguration} from "../application/node-configuration";
import {ConsoleLogger} from "../system/logger/console-logger";
import {TLogger} from "../system/logger/logger";
import {MessageHandlerFactory} from "../server/p2p-network/message-handler-factory";
import {messageHandlers} from "../server/p2p-network/message-handlers/message-handlers";

export const containerConfiguration = [
    P2PNetwork,
    MessageHandlerFactory,
    ...messageHandlers,

    Server,
    ServerConfiguration,
    Swagger,

    Node,
    NodeConfiguration,
    Blockchain,

    { token: TLogger, useClass: ConsoleLogger }
];