export class UnspentTransactionOutput {
    constructor(
        public txOutputId: string,
        public txOutputIndex: number,
        public address: string,
        public amount: number
    ) {}
}