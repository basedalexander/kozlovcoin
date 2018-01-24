const Blockchain = require('./blockchain');
const nodeConfig = require('../config/node-config.json');

const blockchain = new Blockchain();

class Node {
    constructor(blockchain, config) {
        this.blockchain = blockchain;
        this.config = config;

        this.transactions = [];
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    clearTransactions() {
        this.transactions = [];
    }

    mine() {
        const lastBlock = this.blockchain.getLastBlock();
        const lastProof = lastBlock.getProof();
        const proof = this.createProofOfWork(lastProof);

        this.addTransaction({
            from: 'network',
            to: this.config.minerAddress,
            amount: 1
        });

        const newBlockData = {
            proof: proof,
            transactions: this.transactions
        };

        const nextBlock = this.blockchain.createNextBlock(lastBlock, newBlockData);
        this.blockchain.addBlock(nextBlock);

        return nextBlock;
    }

    createProofOfWork(lastProof) {
        let incrementor = lastProof + 1;

        while(
            ((incrementor % 9) !== 0) &&
            ((incrementor % lastProof) !== 0)
        ) {
            incrementor += 1;
        }

        return incrementor;
    }
}

export const node = new Node(blockchain, nodeConfig);