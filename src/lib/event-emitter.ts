export class EventEmitter<T> {
    private listeners = [];

    public subscribe(listener): void  {
        this.listeners.push(listener);
    }

    public unsubscribe(listener): void {
        const index = this.listeners.indexOf(listener);

        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    public unsubscribeAll(): void {
        this.listeners = [];
    }

    public emit(data: T): void {
        this.listeners.forEach(listener => listener(data));
    }
}