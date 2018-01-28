import { Node } from './node';
import { Blockchain } from './blockchain';

describe('Node', () => {
    let node;
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
        node = new Node(blockchain, { minerAddress: 'sdfsfsdfsdf'});
    });

    describe('mine()', () => {
        it('should create new block, add it to the blockchain and then return it', () => {
            const tx = { from: "123", to: "124", amount: 1 };
            node.addTransaction(tx);

            let minedBlockInfo = node.mine();

            expect(minedBlockInfo).toBeTruthy();
            expect(minedBlockInfo.index).toBe(1);
        });
    });
});