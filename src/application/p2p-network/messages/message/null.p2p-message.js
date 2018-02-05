import { Injectable, Inject } from 'container-ioc';

import {TLogger} from "../../../system/logger/logger";

@Injectable([TLogger])
export class NullP2PMessage {
    constructor(@Inject(TLogger) logger) {
        this._logger = logger;
    }

    execute(message) {
        this._logger.warn(`Unhandled incoming message: ${message}`);
        return null;
    }
}