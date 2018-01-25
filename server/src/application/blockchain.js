import { Block } from './block';

export class Blockchain {
    constructor () {
        this._init();
    }

    addBlock(block) {
        this._list.push(block);
    }

    createNextBlock(prevBlock, data) {
        const index = (prevBlock.index + 1);
        const timeStamp = Date.now();

        return new Block(index, timeStamp, data, prevBlock.hash);
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

        return new Block(0, Date.now(), genesysData, '0');
    }
}