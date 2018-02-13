import { CryptoService } from '../../crypto/crypto.service';
import { MockLogger } from '../../../system/logger/lib/mock-logger';
import { TransactionConverterService } from './transaction-converter.service';
import { TransactionUtilsService } from '../../transaction/services/transaction-utils.service';

describe('TransactionUtilsService', () => {
    const logger = new MockLogger();
    const crypto = new CryptoService(logger);
    const utils = new TransactionUtilsService(crypto, logger);
    const service = new TransactionConverterService(utils);

    describe('convertTxsToReports()', () => {
        it(`should return proper amount tx reports`, () => {
            expect(1).toBe(1); // todo
        });
    });
});