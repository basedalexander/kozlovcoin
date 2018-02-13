export interface IScheduler {
    start(): void;
    reset(): void;
    stop(): void;
    kill(): void;
    subscribe(cb: () => void): void;
}

export const TScheduler = 'IScheduler';