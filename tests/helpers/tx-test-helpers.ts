import { Transaction } from '../../src/application/transaction/classes/transaction';
import { TransactionOutput } from '../../src/application/transaction/classes/transaction-output';
import { TransactionInput } from '../../src/application/transaction/classes/transaction-input';

export const createCoinbaseTx = (): Transaction => {
    const genesisInputTransaction = new TransactionInput('', 0, '');
    const genesisOutputTransaction = new TransactionOutput('123', 50);

    return new Transaction('1', [genesisInputTransaction], [genesisOutputTransaction]);
};

export const createTxWith2Outputs = (): Transaction => {
    const inputs: TransactionInput[] = [
        new TransactionInput('', 0, '')
    ];

    const outputs: TransactionOutput[] = [
        new TransactionOutput('1', 1),
        new TransactionOutput('2', 2)
    ];

    return new Transaction('1', inputs, outputs);
};