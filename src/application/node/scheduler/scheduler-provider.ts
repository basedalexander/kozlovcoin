import { TScheduler } from './scheduler.interface';
import { Configuration } from '../../../system/configuration';
import { Scheduler } from './scheduler';
import { DumbScheduler } from './dumb-scheduler';

export const schedulerProvider = {
    provide: TScheduler,
    useFactory: async (config: Configuration, dumbScheduler, scheduler) => {
        if (config.mode === 'test') {
            return dumbScheduler;
        } else {
            return scheduler;
        }
    },
    inject: [Configuration, DumbScheduler, Scheduler]
};