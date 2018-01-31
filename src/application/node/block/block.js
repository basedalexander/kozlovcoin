
export class Block {
    constructor (index, timeStamp, data, previousBlockHash, hash, difficulty, nonce) {
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.previousBlockHash = previousBlockHash;
        this.hash = hash;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
}