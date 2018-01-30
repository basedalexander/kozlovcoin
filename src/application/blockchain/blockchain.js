import { Injectable } from 'container-ioc';

@Injectable()
export class Blockchain {
    constructor () {
        this._blocks = [];
    }

    async getBlocks() {
        return this._blocks;
    }

    async addBlock(block) {
        this._blocks.push(block);
    }

    async getLatestBlock() {
        return this._blocks[this._blocks.length - 1];
    }
}