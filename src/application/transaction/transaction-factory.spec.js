import {TransactionFactory} from "./transaction-factory";

describe('TransactionFactory', () => {
    let transactionFactory;

    let config = {
        minerAddress: "04ca0c8157dac7da27f9563e4ef63a7d7d2f010a5c3e7e1d8b669c01acfd4f580e1638b4db04d8afd45abe4029a205583c5a5610e7f33ee447f2cb72cbe65bf852"
    };

    let utils = { calcBlockHash() {} };

    beforeEach(() => {
        transactionFactory = new TransactionFactory(config, utils);
    });

    xdescribe('createGenesis()', () => {
        describe('block attributes', () => {
            let tx;

            beforeEach(() => {
                tx = transactionFactory.createGenesis();
            });

            it('should have 1 input transaction', () => {
                expect(tx.inputs.length).toBe(1);
            });

            it('should have 1 input tx with  empty fields', () => {
                let inTx = tx.inputs[0];

                expect(inTx.signature).toBe('');
                expect(inTx.txOutputId).toBe('');
                expect(inTx.txOutputIndex).toBe(0);
            });

            it('should have 1 output transaction', () => {
                expect(tx.outputs.length).toBe(1);
            });

            it('should have 1 input tx with empty fields', () => {
                let outTx = tx.outputs[0];

                expect(outTx.address).toBe('');
                expect(outTx.amount).toBe('');
            });
        });

    });
});