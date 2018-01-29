import * as express from "express";

// todo intergrate IoC container

export const NodeController = {
    path: '/node',
    router: router
};

const router = express.Router();

router.post('/sendTransaction', (req, res) => {
    this._node.addTransaction(req.body);
    res.end();
});

router.post('/mineTransaction', (req, res) => {
    const address = req.body.address;
    const amount = req.body.amount;
    const resp = {}; // todo add transaction to the transaction pool and mine a new block
    res.send(resp);
});

router.get('/mineBlock', (req, res) => {
    const minedBlock = this._node.mine();

    res.json({
        index: minedBlock.index,
        timeStamp: minedBlock.timeStamp,
        data: minedBlock.data,
        hash: minedBlock.hash
    });
});

router.get('/blocks', (req, res) => {
    const chain = this._node.getBlocks();
    res.json(chain);
});

router.get('/peers', (req, res) => {
    const peers = this._p2p.getPeers();
    res.json(peers);
});