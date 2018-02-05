import { Component, Inject } from '@nestjs/common';
import { IBlock } from '../block/block.interface';
import { IStorage, TStorage } from '../storage/storage.interface';

@Component()
export class Blockchain {
    private FILE_NAME: string = 'blockchain.json';

    constructor(@Inject(TStorage) private storage: IStorage) {
    }

    async isStored(): Promise<boolean> {
        const lastBlock: IBlock = await this.getLatestBlock();

        if (!lastBlock) {
            return false;
        }

        return true;
    }

    async get(): Promise<IBlock[]> {
        const data: IBlock[] = await this.getBlocks();

        if (data) {
            return data;
        } else {
            return null;
        }
    }

    async set(blocks: IBlock[]): Promise<void> {
        return await this.saveBlocks(blocks);
    }

    async addBlock(block: IBlock): Promise<void> {
        let blocks: IBlock[] = await this.getBlocks();

        if (blocks) {
            blocks.push(block);
        } else {
            blocks = [block];
        }

        await this.saveBlocks(blocks);
    }

    async getLatestBlock(): Promise<IBlock> {
        const blocks: IBlock[] = await this.getBlocks();

        if (blocks && (blocks.length > 0)) {
            return blocks[blocks.length - 1];
        }
    }

    private async getBlocks(): Promise<IBlock[]> {
        return this.storage.get(this.FILE_NAME);
    }

    private saveBlocks(blocks: IBlock[]): Promise<void> {
        return this.storage.set(this.FILE_NAME, blocks);
    }
}