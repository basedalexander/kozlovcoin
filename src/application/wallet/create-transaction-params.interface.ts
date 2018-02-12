export interface ICreateTransactionParams {
    recipientPublicKey: string;
    senderPublicKey: string;
    senderPrivateKey: string;
    amount: number;
}