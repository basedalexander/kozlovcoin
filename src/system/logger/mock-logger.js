import { Injectable } from 'container-ioc';

@Injectable()
export class MockLogger {
    log(message) {
    }

    warn(message) {
    }

    error(message) {
    }
}