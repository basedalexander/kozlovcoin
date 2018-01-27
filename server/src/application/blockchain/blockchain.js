import { Injectable } from 'container-ioc';

@Injectable()
export class Blockchain {
    constructor () {
        this._blocks = [];
    }

    getBlocks() {
        return this._blocks;
    }

    addBlock(block) {
        this._blocks.push(block);
    }

    getLastBlock() {
        return this._blocks[this._blocks.length - 1];
    }
}