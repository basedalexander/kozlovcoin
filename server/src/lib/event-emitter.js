export class EventEmitter {
    constructor() {
        this._listeners = [];
    }

    subscribe(listener) {
        this._listeners.push(listener);
    }

    unsubscribe(listener) {
        const index = this._listeners.indexOf(listener);

        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
    }

    emit(data) {
        this._listeners.forEach(listener => listener(data));
    }
}