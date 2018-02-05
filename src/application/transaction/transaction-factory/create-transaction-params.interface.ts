import { UnspentTransactionOutput } from '../classes/unspent-transaction-output';
import { Transaction } from '../classes/transaction';

export interface ICreateTransactionParams {
    amount: number;
    recipientPublicKey: string;
    senderPublicKey: string;
    senderPrivateKey: string;
    uTxOuts: UnspentTransactionOutput[];
    txPool: Transaction[];
}