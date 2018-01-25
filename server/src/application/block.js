import crypto from 'crypto';

export class Block {
    constructor (index, timeStamp, data, previousBlockHash) {
        this.index = index;
        this.timestamp = timeStamp;
        this.data = data;
        this.previousBlockHash = previousBlockHash;
        this.hash = this._createHash();
    }

    getProof() {
        return this.data.proof;
    }

    _createHash() {
        const hash = crypto.createHash('sha256');
        return hash
            .update(`${this.index}${this.timestamp}${this.data}${this.previousBlockHash}`)
            .digest('hex');
    }
}