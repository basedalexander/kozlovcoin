import { Component } from '@nestjs/common';
import { IBlock } from './block.interface';
import { Block } from './block';
import { BlockUtilsService } from './block-utils.service';
import { Transaction } from '../transaction/classes/transaction';

@Component()
export class BlockFactory {
    constructor(
        private utils: BlockUtilsService
    ) {
    }

    public createGenesis(genesisTx): IBlock {
        const index = 0;
        const timeStamp = 1465154705;
        const data = [genesisTx];
        const previousBlockHash = '';
        const hash = '';
        const difficulty = 0;
        const nonce = 0;

        const block = new Block(index, timeStamp, data, previousBlockHash, hash, difficulty, nonce);

        block.hash = this.utils.calcHashForBlock(block);

        return block;
    }

    public createNew(
        blockData: Transaction[],
        blockchain: IBlock[],
        difficultyInterval: number,
        difficultyAdjastmentInterval: number): IBlock {

        const difficulty: number = this.utils.getDifficulty(blockchain, difficultyInterval, difficultyAdjastmentInterval);

        const lastBlock: IBlock = blockchain[blockchain.length - 1];
        const newBlockIndex: number = lastBlock.index + 1;
        const timeStamp: number = this.utils.getCurrentTimesStamp();

        const newBlock: IBlock = this.utils.mineBlock(
            newBlockIndex,
            lastBlock.hash,
            timeStamp,
            blockData,
            difficulty
        );

        return newBlock;
    }
}