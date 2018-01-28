import { Blockchain } from "./blockchain";

describe('Blockchain', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    describe('getLastBlock', () => {
        it('should return genesysBlock after initialization', () => {
            const lastBlock = blockchain.getLastBlock();

            expect(lastBlock.index).toBe(0);
        });
    });

    describe('createNextBlock', () => {
        it('should create new block with incremented index', () => {
            const lastBlock = blockchain.getLastBlock();
            const nextBlock = blockchain.createNextBlock(lastBlock, {
               proof: 4,
               transactions: []
            });

            expect(nextBlock.index).toBe(1);
        });
    });

    describe('addBlock', () => {
        it('should add new-created block to the chain', () => {
            const lastBlock = blockchain.getLastBlock();
            const nextBlock = blockchain.createNextBlock(lastBlock, {
                proof: 4,
                transactions: []
            });

            blockchain.addBlock(nextBlock);

            expect(blockchain.getLastBlock()).toBe(nextBlock);
        });
    });
});