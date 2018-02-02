import { Injectable } from 'container-ioc';

@Injectable()
export class MockLogger {
    log(message) {
    }

    warn(...args){
        
    }

    warn(message) {
    }

    error(message) {
    }
}