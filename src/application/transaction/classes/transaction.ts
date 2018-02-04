import { TransactionInput } from './transaction-input';
import { TransactionOutput } from './transaction-output';

export class Transaction {
    constructor(
        public id: string,
        public inputs: TransactionInput[],
        public outputs: TransactionOutput[]
    ) {}
}