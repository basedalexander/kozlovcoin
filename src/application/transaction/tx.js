export class Transaction {
    constructor(id, txInputs, txOutputs) {
        this.id = id;
        this.inputs = txInputs;
        this.outputs = txOutputs;
    }
}