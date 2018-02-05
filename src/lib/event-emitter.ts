export class EventEmitter {
    private listeners = [];

    subscribe(listener) {
        this.listeners.push(listener);
    }

    unsubscribe(listener) {
        const index = this.listeners.indexOf(listener);

        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    emit(data) {
        this.listeners.forEach(listener => listener(data));
    }
}