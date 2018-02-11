import { Component } from '@nestjs/common';

@Component()
export class SystemConstants {
    public COINBASE_AMOUNT = 50;
    public BLOCK_GENERATION_INTERVAL = 10;
    public DIFFICULTY_ADJUSTMENT_INTERVAL = 10;
}