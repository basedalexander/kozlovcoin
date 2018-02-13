import { Component } from '@nestjs/common';
import { IScheduler } from './scheduler.interface';

@Component()
export class DumbScheduler implements IScheduler {
    start(): void {
        return null;
    }

    reset(): void {
        return null;
    }

    stop(): void {
        return null;
    }

    kill(): void {
        return null;
    }

    subscribe(cb: () => void): void {
        return null;
    }
}