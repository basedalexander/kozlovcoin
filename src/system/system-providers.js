import {Environment} from "./environment";
import {TLogger} from "./logger/logger";
import {ConsoleLogger} from "./logger/console-logger";
import {MockLogger} from "./logger/mock-logger";
import {requestLoggerProvider} from "./logger/request-logger";

export const SYSTEM_PROVIDERS = [
    Environment,
    MockLogger,
    ConsoleLogger,
    {
        token: TLogger, useFactory: (env, consoleLogger, mockLogger) => {
        if (env.mode === 'test') {
            return mockLogger;
        } else {
            return consoleLogger;
        }
    },
        inject: [Environment, ConsoleLogger, MockLogger]
    },
    requestLoggerProvider,
];