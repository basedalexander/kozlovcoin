import * as express from "express";

// todo intergrate IoC container

export const WalletController = {
    path: '/wallet',
    router: router
};

const router = express.Router();

router.get('/balance', (req, res) => {
    res.send({});
});