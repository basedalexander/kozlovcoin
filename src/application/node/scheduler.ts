import { Component } from '@nestjs/common';
import { SystemConstants } from '../../system/system-constants';
import { EventEmitter } from '../../lib/event-emitter';

@Component()
export class Scheduler extends EventEmitter<void> {
    private timeoutId: any;

    constructor(private constants: SystemConstants) {
        super();
    }

    private get interval(): number {
        return this.constants.BLOCK_GENERATION_INTERVAL;
    }

    public start(): void {
        // this.makeLoop();
    }

    public reset(): void {
        //this.stop();
        //this.start();
    }

    public stop(): void {
        //clearTimeout(this.timeoutId);
    }

    public kill(): void {
        this.stop();
        this.unsubscribeAll();
    }

    private makeLoop(): void {
        this.timeoutId = setTimeout( () => {
            this.tick();
            this.makeLoop();
        }, this.interval);
    }

    private tick(): void {
        this.emit(null);
    }
}