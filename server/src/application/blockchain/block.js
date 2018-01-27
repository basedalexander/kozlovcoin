import crypto from 'crypto';

export class Block {
    constructor (index, date, data, previousBlockHash) {
        this.index = index;
        this.timeStamp = date.toISOString();
        this.data = data;
        this.previousBlockHash = previousBlockHash;
        this.hash = Block.createHash(this);
    }

    static createHash(block) {
        const hash = crypto.createHash('sha256');
        const data = JSON.stringify(block.data);

        return hash
            .update(`${block.index}${block.timeStamp}${data}${block.previousBlockHash}`)
            .digest('hex');
    }
}