import {BlockFactory} from "./block-factory";

describe('BlockFactory', () => {
    let blockFactory;

    let config = {
        minerAddress: "04ca0c8157dac7da27f9563e4ef63a7d7d2f010a5c3e7e1d8b669c01acfd4f580e1638b4db04d8afd45abe4029a205583c5a5610e7f33ee447f2cb72cbe65bf852"
    };

    let utils = { calcBlockHash() {} };

    beforeEach(() => {
        blockFactory = new BlockFactory(config, utils);
    });

    describe('createGenesis()', () => {
        describe('block attributes', () => {
            let block;

            beforeEach(() => {
                block = blockFactory.createGenesis();
            });

            it('should have valid index', () => {
                expect(block.index).toBe(0);
            });

            it('should have valid timeStamp', () => {
                expect(block.timeStamp).toBe(1465154705);
            });

            it('should have valid previousBlockHash', () => {
                expect(block.previousBlockHash).toBe('');
            });

            it('should have valid difficulty', () => {
                expect(block.difficulty).toBe(0);
            });

            it('should have valid nonce', () => {
                expect(block.nonce).toBe(0);
            });
        });

    });
});