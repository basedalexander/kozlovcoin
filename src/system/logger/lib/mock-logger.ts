/* tslint:disable:no-empty */

import { Component } from '@nestjs/common';

import { ILogger } from '../interfaces/logger.interface';

@Component()
export class MockLogger implements ILogger {
    log() { }
    info() { }
    warn() { }
    error() { }
}