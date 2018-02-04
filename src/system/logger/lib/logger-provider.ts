import { TLogger } from '../interfaces/logger.interface';
import { ConsoleLogger } from './console-logger';
import { MockLogger } from './mock-logger';
import { StagingLogger } from './staging-logger';
import { Environment } from '../../environment/environment';

export const loggerProvider = {
    provide: TLogger,
    useFactory: async (env, consoleLogger, stagingLogger, mockLogger) => {
        if (env.mode === 'local') {
            return consoleLogger;
        } else if (env.mode === 'test') {
            return mockLogger;
        } else {
            return stagingLogger;
        }
    },
    inject: [Environment, ConsoleLogger, StagingLogger, MockLogger]
};