export class UnspentTxOutput {
    constructor(txOutputId, txOutputIndex, address, amount) {
        this.txOutputId = txOutputId;
        this.txOutputIndex = txOutputIndex;
        this.address = address;
        this.amount = amount;
    }
}