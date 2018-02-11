import { Component } from '@nestjs/common';
import { Transaction } from '../transaction/classes/transaction';
import { IBlock } from '../block/block.interface';

@Component()
export class MiningHelpersService {
    public getDifficulty(
        blockchain: IBlock[],
        blockGenerationInterval: number,
        difficultyAdjustmentInterval: number
    ): number {
        const latestBlock: IBlock = blockchain[blockchain.length - 1];
        if (latestBlock.index % difficultyAdjustmentInterval === 0 && latestBlock.index !== 0) {
            return this.getAdjustedDifficulty(latestBlock, blockchain, blockGenerationInterval, difficultyAdjustmentInterval);
        } else {
            return latestBlock.difficulty;
        }
    }

    public getAdjustedDifficulty(
        lastBlock: IBlock,
        blockchain: IBlock[],
        blockGenerationInterval: number,
        difficultyAdjustmentInterval: number
    ): number {
        if (lastBlock.index % difficultyAdjustmentInterval === 0 && lastBlock.index !== 0) {
            return this.getAdjustedDifficulty(lastBlock, blockchain, blockGenerationInterval, difficultyAdjustmentInterval);
        } else {
            return lastBlock.difficulty;
        }
    }
}