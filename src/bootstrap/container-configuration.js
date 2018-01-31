import {Server} from "../server/server";
import {Swagger} from "../server/swagger";
import {Blockchain} from "../application/blockchain/blockchain";
import {ConsoleLogger} from "../system/logger/console-logger";
import {TLogger} from "../system/logger/logger";
import { requestLoggerProvider } from "../system/logger/request-logger";
import { Environment } from "../system/environment";
import { Configuration } from "./configuration";
import { controllers } from "../application/api/controllers/index";
import {ControllerFactory} from "../application/api/controller-factory";
import {WALLET_PROVIDERS} from "../application/wallet/wallet-providers";
import {TRANSACTION_PROVIDERS} from "../application/transaction/transaction-providers";
import {P2P_PROVIDERS} from "../p2p-network/p2p-providers";
import {NODE_PROVIDERS} from "../application/node/node-providers";

export const containerConfiguration = [
    Server,
    ...controllers,
    ControllerFactory,
    Swagger,

    Blockchain,

    Environment,
    Configuration,
    { token: TLogger, useClass: ConsoleLogger },
    requestLoggerProvider,

    ...NODE_PROVIDERS,
    ...P2P_PROVIDERS,
    ...TRANSACTION_PROVIDERS,
    ...WALLET_PROVIDERS
];