import { Component } from '@nestjs/common';
import { SystemConstants } from '../../system/system-constants';
import { EventEmitter } from '../../lib/event-emitter';

@Component()
export class Scheduler extends EventEmitter<void> {
    private intervalId: any;

    constructor(private constants: SystemConstants) {
        super();
    }

    public start(): void {
        this.intervalId = setInterval(() => this.tick() , this.constants.BLOCK_GENERATION_INTERVAL * 1000);
    }

    public reset(): void {
        this.stop();
        this.start();
    }

    public stop(): void {
        clearInterval(this.intervalId);
    }

    public kill(): void {
        this.stop();
        this.unsubscribeAll();
    }

    private tick(): void {
        this.emit(null);
    }
}