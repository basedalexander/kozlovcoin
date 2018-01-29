import {P2PNetwork} from "../p2p-network/p2p-network";
import {Server} from "../server/server";
import {Swagger} from "../server/swagger";
import {Node } from '../application/node';
import {Blockchain} from "../application/blockchain/blockchain";
import {ConsoleLogger} from "../system/logger/console-logger";
import {TLogger} from "../system/logger/logger";
import {MessageHandlerFactory} from "../p2p-network/message-handler-factory";
import { messageHandlers } from "../p2p-network/message-handlers/message-handlers";
import { requestLoggerProvider } from "../system/logger/request-logger";
import { Environment } from "../system/environment";
import { Configuration } from "./configuration";
import { controllers } from "../application/api/controllers/index";
import {ControllerFactory} from "../application/api/controller-factory";
import {TxUtilsService} from "../application/transaction/tx-utils.service";
import {TxValidationService} from "../application/transaction/tx-validation.service";
import {WALLET_PROVIDERS} from "../application/wallet/wallet-providers";

export const containerConfiguration = [
    P2PNetwork,
    MessageHandlerFactory,
    ...messageHandlers,

    Server,
    ...controllers,
    ControllerFactory,
    Swagger,

    Node,
    Blockchain,

    TxUtilsService,
    TxValidationService,

    Environment,
    Configuration,
    { token: TLogger, useClass: ConsoleLogger },
    requestLoggerProvider,

    ...WALLET_PROVIDERS
];