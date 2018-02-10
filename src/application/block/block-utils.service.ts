import { Component } from '@nestjs/common';

import { CryptoService } from '../crypto/crypto.service';
import { IBlock } from './block.interface';
import { Transaction } from '../transaction/classes/transaction';
import { Block } from './block';
import { hexToBinary } from '../../lib/utils';

@Component()
export class BlockUtilsService {
    constructor(private crypto: CryptoService) {
    }

    public mineBlock(
        index: number,
        previousBlockHash,
        timeStamp: number,
        blockData: Transaction[],
        difficulty: number
    ): IBlock {
        let nonce = 0;

        while (true) {
            const hash: string = this.calcHashForBlockParams(index, timeStamp, blockData, previousBlockHash, difficulty, nonce);

            if (this.checkHashMatchesDifficulty(hash, difficulty)) {
                return new Block(index, timeStamp, blockData, previousBlockHash, hash, difficulty, nonce);
            }

            nonce++;
        }
    }

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

    public getCurrentTimesStamp(): number {
        return Math.round(new Date().getTime() / 1000);
    }

    public calcHashForBlock(block: IBlock): string {
        const blockAsString: string = this.blockToString(block);
        return this.crypto.createSHA256Hash(blockAsString);
    }

    public calcHashForBlockParams(
        index: number,
        timeStamp: number,
        data: Transaction[],
        previousBlockHash: string,
        difficulty: number,
        nonce: number
    ): string {
        const tempBlock = new Block(index, timeStamp, data, previousBlockHash, '', difficulty, nonce);
        return this.calcHashForBlock(tempBlock);
    }

    public checkHashMatchesDifficulty(hash: string, difficulty: number): boolean {
        const hashInBinary: string = hexToBinary(hash);
        const requiredPrefix: string = '0'.repeat(difficulty);
        return hashInBinary.startsWith(requiredPrefix);
    }

    private blockToString(b: IBlock): string {
        return `${b.index}${b.timeStamp}${JSON.stringify(b.data)}${b.previousBlockHash}${b.difficulty}${b.nonce}`;
    }
}