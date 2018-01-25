export class ConsoleLogger {
    log(message) {
        this._log('log', message);
    }

    warn(message) {
        this._log('warn', message);
    }

    error(message) {
        this._log('error', message);
    }


    _log(method, message) {
        console[method](message); // eslint-disable-line no-console
    }
}