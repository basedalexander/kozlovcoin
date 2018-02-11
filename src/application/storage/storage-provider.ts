import { Configuration } from '../../system/configuration';
import { FSStorage } from './fs-storage';
import { InMemoryStorage } from './in-memory-storage';
import { TStorage } from './storage.interface';

export const storageProvider = {
    provide: TStorage,
    useFactory: (config, memStorage, fsStorage) => {
        if (config.mode === 'staging') {
            return fsStorage;
        } else {
            return memStorage;
        }
    },
    inject: [Configuration, InMemoryStorage, FSStorage]
};