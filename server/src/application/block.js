import crypto from 'crypto';

export class Block {
    constructor (index, timeStamp, data, previousBlockHash) {
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.previousBlockHash = previousBlockHash;
        this.hash = this._createHash();
    }

    getProof() {
        return this.data.proof;
    }

    _createHash() {
        const hash = crypto.createHash('sha256');
        const data = JSON.stringify(this.data);

        return hash
            .update(`${this.index}${this.timeStamp}${data}${this.previousBlockHash}`)
            .digest('hex');
    }
}