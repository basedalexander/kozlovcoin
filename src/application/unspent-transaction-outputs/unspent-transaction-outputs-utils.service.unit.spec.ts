import { UnspentTransactionOutputsUtilsService } from './unspent-transaction-outputs-utils.service';
import { Transaction } from '../transaction/classes/transaction';
import { TransactionInput } from '../transaction/classes/transaction-input';
import { TransactionOutput } from '../transaction/classes/transaction-output';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';

describe('UnspentTransactionOutputsUtilsService', () => {
    const service = new UnspentTransactionOutputsUtilsService();

    describe('txsToUnspentTxOuts()', () => {
        it('should convert transactions with only one genesis tx', () => {
            const txs: Transaction[] = [createGenesisTx()];

            const uTxOuts: UnspentTransactionOutput[] = service.txsToUnspentTxOuts(txs);

            expect(uTxOuts.length).toBe(1);

            expect(uTxOuts[0]).toMatchObject({
                txOutputId: '1',
                txOutputIndex: 0,
                address: '123',
                amount: 50
            });
        });

        it('should convert 1 tx with 2 outputs', () => {
            const txs: Transaction[] = [createTxWith2Outputs()];

            const uTxOuts: UnspentTransactionOutput[] = service.txsToUnspentTxOuts(txs);

            expect(uTxOuts.length).toBe(2);

            expect(uTxOuts[0]).toMatchObject({
                txOutputId: '1',
                txOutputIndex: 0,
                address: '1',
                amount: 1
            });

            expect(uTxOuts[1]).toMatchObject({
                txOutputId: '1',
                txOutputIndex: 1,
                address: '2',
                amount: 2
            });
        });

        it('should convert many transactions', () => {
            const txs: Transaction[] = [createTxWith2Outputs(), createTxWith2Outputs()];

            const uTxOuts: UnspentTransactionOutput[] = service.txsToUnspentTxOuts(txs);

            expect(uTxOuts.length).toBe(4);

            expect(uTxOuts[0]).toMatchObject({
                txOutputId: '1',
                txOutputIndex: 0,
                address: '1',
                amount: 1
            });

            expect(uTxOuts[1]).toMatchObject({
                txOutputId: '1',
                txOutputIndex: 1,
                address: '2',
                amount: 2
            });

            expect(uTxOuts[2]).toMatchObject({
                txOutputId: '1',
                txOutputIndex: 0,
                address: '1',
                amount: 1
            });

            expect(uTxOuts[3]).toMatchObject({
                txOutputId: '1',
                txOutputIndex: 1,
                address: '2',
                amount: 2
            });
        });
    });

    describe('txsToConsumedTxOuts()', () => {
        it('should return list of uTxOutputs from list with one genesis tx', () => {
            const txs: Transaction[] = [createGenesisTx()];

            const uTxOuts: UnspentTransactionOutput[] = service.txsToConsumedTxOuts(txs);

            expect(uTxOuts.length).toBe(1);

            expect(uTxOuts[0]).toMatchObject({
               txOutputId: '',
               txOutputIndex: 0
            });
        });

        it('should return list of uTxOutputs from list with 2 transactions', () => {
            const txs: Transaction[] = [createTxWith2Outputs(), createTxWith2Outputs()];

            const uTxOuts: UnspentTransactionOutput[] = service.txsToConsumedTxOuts(txs);

            expect(uTxOuts.length).toBe(2);

            expect(uTxOuts[0]).toMatchObject({
                txOutputId: '',
                txOutputIndex: 0
            });

            expect(uTxOuts[1]).toMatchObject({
                txOutputId: '',
                txOutputIndex: 0
            });
        });

        it('should return empty list if no transaction provided', () => {
            const txs: Transaction[] = [];

            const uTxOuts: UnspentTransactionOutput[] = service.txsToConsumedTxOuts(txs);

            expect(uTxOuts.length).toBe(0);
        });
    });

    describe('removeConsumedTxOuts()', () => {
        it('should return list of not consumed unspentTxOuts', () => {
            const uTxOuts: UnspentTransactionOutput[] = [
                {
                    txOutputId: '1',
                    txOutputIndex: 1,
                    address: '',
                    amount: 1
                },
                {
                    txOutputId: '2',
                    txOutputIndex: 2,
                    address: '',
                    amount: 1
                },
                {
                    txOutputId: '3',
                    txOutputIndex: 3,
                    address: '',
                    amount: 1
                }
            ];

            const consumedUnspentTxOuts: UnspentTransactionOutput[] = [
                {
                    txOutputId: '2',
                    txOutputIndex: 2,
                    address: '',
                    amount: 1
                },
                {
                    txOutputId: '3',
                    txOutputIndex: 3,
                    address: '',
                    amount: 1
                }
            ];

            const unconsumedUnspentTxOuts: UnspentTransactionOutput[] =
                service.removeConsumedUTxOuts(uTxOuts, consumedUnspentTxOuts);

            expect(unconsumedUnspentTxOuts.length).toBe(1);

            expect(unconsumedUnspentTxOuts[0]).toMatchObject({
                txOutputId: '1',
                txOutputIndex: 1,
            });
        });
    });

    describe('addNewUnspentTxOuts()', () => {
        it('should append existing list of uTxOuts with new ones', () => {
            const uTxOuts: UnspentTransactionOutput[] = [
                {
                    txOutputId: '1',
                    txOutputIndex: 1,
                    address: '',
                    amount: 1
                },
                {
                    txOutputId: '2',
                    txOutputIndex: 2,
                    address: '',
                    amount: 1
                },
                {
                    txOutputId: '3',
                    txOutputIndex: 3,
                    address: '',
                    amount: 1
                }
            ];

            const newTxOuts: UnspentTransactionOutput[] = [
                {
                    txOutputId: '4',
                    txOutputIndex: 4,
                    address: '',
                    amount: 1
                },
                {
                    txOutputId: '5',
                    txOutputIndex: 5,
                    address: '',
                    amount: 1
                }
            ];

            service.addNewUTxOuts(uTxOuts, newTxOuts);

            expect(uTxOuts.length).toBe(5);
        });
    });
});

const createGenesisTx = (): Transaction => {
    const genesisInputTransaction = new TransactionInput('', 0, '');
    const genesisOutputTransaction = new TransactionOutput('123', 50);

    return new Transaction('1', [genesisInputTransaction], [genesisOutputTransaction]);
};

const createTxWith2Outputs = (): Transaction => {
    const inputs: TransactionInput[] = [
            new TransactionInput('', 0, '')
    ];

    const outputs: TransactionOutput[] = [
        new TransactionOutput('1', 1),
        new TransactionOutput('2', 2)
    ];

    return new Transaction('1', inputs, outputs);
};