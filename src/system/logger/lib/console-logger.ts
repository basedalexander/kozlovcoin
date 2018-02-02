/* tslint:disable:no-console */

import { Component } from '@nestjs/common';
import { ILogger } from '../interfaces/logger.interface';

@Component()
export class ConsoleLogger implements ILogger {
    log(...args): void {
        this._log('log', ...args);
    }

    info(...args): void {
        this._log('info', ...args);
    }

    warn(...args): void {
        this._log('warn', ...args);
    }

    error(...args): void {
        this._log('error', ...args);
    }

    private _log(method, ...args) {
        console[method](...args);
    }
}