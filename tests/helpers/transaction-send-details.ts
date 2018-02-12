export class TransactionSendDetails {
    constructor(
        public recipientPublicKey: string,
        public senderPublicKey: string,
        public senderPrivateKey: string,
        public amount: number
    ) {

    }
}