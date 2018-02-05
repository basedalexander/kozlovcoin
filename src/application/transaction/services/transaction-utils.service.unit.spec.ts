import { TransactionUtilsService } from './transaction-utils.service';
import { CryptoService } from '../../crypto/crypto.service';
import { UnspentTransactionOutput } from '../classes/unspent-transaction-output';
import { TransactionInput } from '../classes/transaction-input';
import { MockLogger } from '../../../system/logger/lib/mock-logger';

describe('TransactionUtilsService', () => {
    const crypto = new CryptoService();
    const logger = new MockLogger();
    const service = new TransactionUtilsService(crypto, logger);

    describe('getUTxOutsForAddress()', () => {
        it('should should return only uTxOuts for specified address', () => {
            const addr: string = '234';

            const uTxOuts: UnspentTransactionOutput[] = [
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 0,
                    address: '123'
                },
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 0,
                    address: addr
                },
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 0,
                    address: addr
                }
            ];

            const result: UnspentTransactionOutput[] = service.getUTxOutsForAddress(addr, uTxOuts);

            expect(result.length).toBe(2);

            expect(result[0]).toMatchObject({
                address: addr
            });

            expect(result[1]).toMatchObject({
                address: addr
            });
        });

        it(`should return an empty list if uTxOuts weren't found`, () => {
            const addr: string = '234';

            const uTxOuts: UnspentTransactionOutput[] = [
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 0,
                    address: '123'
                },
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 0,
                    address: addr
                },
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 0,
                    address: addr
                }
            ];

            const result: UnspentTransactionOutput[] = service.getUTxOutsForAddress('355', uTxOuts);

            expect(result.length).toBe(0);
        });
    });

    describe('searchUTxOutsForAmount()', () => {
        it('should return list of uTxOuts sum amount of which is bigger or equal to the amount requested', () => {
            const addr: string = '234';

            const uTxOuts: UnspentTransactionOutput[] = [
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 50,
                    address: '123'
                },
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 21,
                    address: addr
                },
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 2,
                    address: addr
                }
            ];

            const result: UnspentTransactionOutput[] = service.searchUTxOutsForAmount(uTxOuts, 20);

            expect(result.length).toBe(1);

            expect(result[0]).toMatchObject({
                txOutputId: '',
                txOutputIndex: 0,
                amount: 50,
                address: '123'
            });
        });
    });

    describe('getLeftOverAmount()', () => {
        it(`should return result of all outputs' amount minus provided amount`, () => {
            const addr: string = '234';

            const uTxOuts: UnspentTransactionOutput[] = [
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 50,
                    address: '123'
                },
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 21,
                    address: addr
                },
                {
                    txOutputId: '',
                    txOutputIndex: 0,
                    amount: 2,
                    address: addr
                }
            ];

            const result: number = service.getLeftOverAmount(uTxOuts, 50);

            expect(result).toBe(0);
        });
    });

    describe('uTxOutsToUnsignedTxInputs()', () => {
        it('should return correct txInputs converted from uTxOuts', () => {
            const uTxOuts: UnspentTransactionOutput[] = [
                {
                    txOutputId: '2',
                    txOutputIndex: 0,
                    amount: 50,
                    address: '123'
                },
                {
                    txOutputId: '4',
                    txOutputIndex: 0,
                    amount: 21,
                    address: '234'
                },
                {
                    txOutputId: '7',
                    txOutputIndex: 0,
                    amount: 2,
                    address: '234'
                }
            ];

            const unsignedInputs: TransactionInput[] = service.uTxOutsToUnsignedTxInputs(uTxOuts);

            expect(unsignedInputs.length).toBe(3);
        });
    });
});