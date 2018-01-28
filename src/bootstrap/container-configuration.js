import {P2PNetwork} from "../p2p-network/p2p-network";
import {Server} from "../server/server";
import {ServerConfiguration} from "../server/server-configuration";
import {Swagger} from "../server/swagger";
import {Node } from '../application/node';
import {Blockchain} from "../application/blockchain/blockchain";
import {ConsoleLogger} from "../system/logger/console-logger";
import {TLogger} from "../system/logger/logger";
import {MessageHandlerFactory} from "../p2p-network/message-handler-factory";
import { messageHandlers } from "../p2p-network/message-handlers/message-handlers";
import { requestLoggerProvider } from "../system/logger/request-logger";
import { Environment } from "../system/environment";
import { Configuration } from "../system/configuration";
import {P2PNetworkConfiguration} from "../p2p-network/p2p-network-configuration";

export const containerConfiguration = [
    P2PNetwork,
    P2PNetworkConfiguration,
    MessageHandlerFactory,
    ...messageHandlers,

    Server,
    ServerConfiguration,
    Swagger,

    Node,
    Blockchain,

    Environment,
    {
        token: Configuration,
        useFactory: (env) => {
            const configPrefix = env.config ? env.config : 'local';
            return require(`../../config/${configPrefix}-config.json`);
        },
        inject: [Environment]
    },
    { token: TLogger, useClass: ConsoleLogger },
    requestLoggerProvider
];