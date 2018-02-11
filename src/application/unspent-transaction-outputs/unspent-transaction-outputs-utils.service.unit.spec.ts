import { UnspentTransactionOutputsUtilsService } from './unspent-transaction-outputs-utils.service';
import { Transaction } from '../transaction/classes/transaction';
import { UnspentTransactionOutput } from '../transaction/classes/unspent-transaction-output';
import { createCoinbaseTx, createTxWith2Outputs } from '../../../tests/helpers/tx-test-helpers';

describe('UnspentTransactionOutputsUtilsService', () => {
    const service = new UnspentTransactionOutputsUtilsService();

    describe('convertTxsToUnspentTxOuts()', () => {
        it('should convert transactions with only one genesis tx', () => {
            const txs: Transaction[] = [createCoinbaseTx()];

            const uTxOuts: UnspentTransactionOutput[] = service.convertTxsToUnspentTxOuts(txs);

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

            const uTxOuts: UnspentTransactionOutput[] = service.convertTxsToUnspentTxOuts(txs);

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

            const uTxOuts: UnspentTransactionOutput[] = service.convertTxsToUnspentTxOuts(txs);

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

    describe('convertTxsToConsumedTxOuts()', () => {
        it('should return list of uTxOutputs from list with one genesis tx', () => {
            const txs: Transaction[] = [createCoinbaseTx()];

            const uTxOuts: UnspentTransactionOutput[] = service.convertTxsToConsumedTxOuts(txs);

            expect(uTxOuts.length).toBe(1);

            expect(uTxOuts[0]).toMatchObject({
                txOutputId: '',
                txOutputIndex: 0
            });
        });

        it('should return list of uTxOutputs from list with 2 transactions', () => {
            const txs: Transaction[] = [createTxWith2Outputs(), createTxWith2Outputs()];

            const uTxOuts: UnspentTransactionOutput[] = service.convertTxsToConsumedTxOuts(txs);

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

            const uTxOuts: UnspentTransactionOutput[] = service.convertTxsToConsumedTxOuts(txs);

            expect(uTxOuts.length).toBe(0);
        });
    });

    describe('filterOutConsumedUTxOuts()', () => {
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
                service.filterOutConsumedUTxOuts(uTxOuts, consumedUnspentTxOuts);

            expect(unconsumedUnspentTxOuts.length).toBe(1);

            expect(unconsumedUnspentTxOuts[0]).toMatchObject({
                txOutputId: '1',
                txOutputIndex: 1
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

    describe('updateUTxOutsWithNewTxs()', () => {
        it('should return correctly updated uTxOuts', () => {

            const txs: Transaction[] = [
                createCoinbaseTx(),
                {
                    id: '2',
                    timeStamp: 0,
                    inputs: [
                        {
                            txOutputId: '1',
                            txOutputIndex: 0,
                            signature: ''
                        }
                    ],
                    outputs: [
                        {
                            address: '123',
                            amount: 20
                        },
                        {
                            address: '1337',
                            amount: 30
                        }
                    ]
                },
                {
                    id: '3',
                    timeStamp: 0,
                    inputs: [
                        {
                            txOutputId: '2',
                            txOutputIndex: 1,
                            signature: ''
                        }
                    ],
                    outputs: [
                        {
                            address: '1337',
                            amount: 10
                        },
                        {
                            address: '2000',
                            amount: 20
                        }
                    ]
                }
            ];

            const existingUTxOuts: UnspentTransactionOutput[] = service.updateUTxOutsWithNewTxs([], txs);

            expect(existingUTxOuts.length).toBe(3);
        });

        it('should return correctly updated list of uTxOuts from already existing uTxOutputs', () => {
            const txs: Transaction[] = [
                createCoinbaseTx(),
                {
                    id: '2',
                    timeStamp: 0,
                    inputs: [
                        {
                            txOutputId: '1',
                            txOutputIndex: 0,
                            signature: ''
                        }
                    ],
                    outputs: [
                        {
                            address: '123',
                            amount: 20
                        },
                        {
                            address: '1337',
                            amount: 30
                        }
                    ]
                },
                {
                    id: '3',
                    timeStamp: 0,
                    inputs: [
                        {
                            txOutputId: '2',
                            txOutputIndex: 1,
                            signature: ''
                        }
                    ],
                    outputs: [
                        {
                            address: '1337',
                            amount: 10
                        },
                        {
                            address: '2000',
                            amount: 20
                        }
                    ]
                }
            ];

            let existingUTxOuts: UnspentTransactionOutput[] = service.updateUTxOutsWithNewTxs([], txs);

            const newTransactions: Transaction[] = [
                {
                    id: '4',
                    timeStamp: 0,
                    inputs: [
                        {
                            txOutputId: '2',
                            txOutputIndex: 0,
                            signature: ''
                        }
                    ],
                    outputs: [
                        {
                            address: '123',
                            amount: 10
                        },
                        {
                            address: '5000',
                            amount: 10
                        }
                    ]
                }
            ];

            existingUTxOuts = service.updateUTxOutsWithNewTxs(existingUTxOuts, newTransactions);

            expect(existingUTxOuts.length).toBe(4);

            expect(existingUTxOuts[0]).toMatchObject({
                address: '1337',
                amount: 10,
                txOutputId: '3',
                txOutputIndex: 0
            });

            expect(existingUTxOuts[1]).toMatchObject({
                address: '2000',
                amount: 20,
                txOutputId: '3',
                txOutputIndex: 1
            });

            expect(existingUTxOuts[2]).toMatchObject({
                address: '123',
                amount: 10,
                txOutputId: '4',
                txOutputIndex: 0
            });

            expect(existingUTxOuts[3]).toMatchObject({
                address: '5000',
                amount: 10,
                txOutputId: '4',
                txOutputIndex: 1
            });
        });
    });
});