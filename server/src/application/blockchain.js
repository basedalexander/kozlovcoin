import { Block } from './block';

export class Blockchain {
    constructor () {
        this._init();
    }

    getBlocks() {
        return this._list;
    }

    addBlock(block) {
        this._list.push(block);
    }

    createNextBlock(prevBlock, data) {
        const index = (prevBlock.index + 1);
        const date = new Date();

        return new Block(index, date, data, prevBlock.hash);
    }

    getLastBlock() {
        return this._list[this._list.length - 1];
    }

    _init() {
        this._list = [];
        this._list.push(this._createGenesysBlock());
    }

    _createGenesysBlock() {
        const genesysData = {
            proof: 0,
            transactions: []
        };

        return new Block(0, new Date(), genesysData, '0');
    }
}