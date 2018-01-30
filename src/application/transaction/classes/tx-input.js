export class TxInput {
    constructor(txOutputId, txOutputIndex, signature) {
        this.txOutputId = txOutputId;
        this.txOutputIndex = txOutputIndex;
        this.signature = signature;
    }
}