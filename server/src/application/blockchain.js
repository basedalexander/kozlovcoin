import { Block } from './block';

export class Blockchain {
    constructor () {
        this.init();
    }

    init() {
        this.list = [];
        this.list.push(this.createGenesysBlock());
    }

    addBlock(block) {
        this.list.push(block);
    }

    createGenesysBlock() {
        return new Block(0, Date.now(), 'Genesys', '0');
    }

    createNextBlock(prevBlock, data) {
        const index = (prevBlock.index + 1);
        const timeStamp = Date.now();

        return new Block(index, timeStamp, data, prevBlock.hash);
    }

    getLastBlock() {
        return this.list[this.list.length - 1];
    }
}