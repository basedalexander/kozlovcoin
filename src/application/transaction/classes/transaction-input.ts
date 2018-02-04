export class TransactionInput {
    constructor(
        public txOutputId: string,
        public txOutputIndex: number,
        public signature: string
    ) {
    }
}