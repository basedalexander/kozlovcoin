import { Injectable, Inject } from 'container-ioc';
import { BaseController } from "./base-controller";
import { TLogger } from "../../../system/logger/logger";
import { Controller } from "../controller.decorator";
import {WalletManager} from "../../wallet/wallet-manager";

@Controller({
    path: '/wallet'
})
@Injectable([TLogger, WalletManager])
export class WalletController extends BaseController {
    constructor(
        @Inject(TLogger) logger,
        @Inject(WalletManager) walletManager,
    ) {
        super();
        this._walletManager = walletManager;
        this._logger = logger;
    }

    init() {
        this.router.get('/new', async(req, res) => {
            const wallet = await this._walletManager.getNewWallet();
            res.json(wallet);
        });

        this.router.get('/balance/:address', async(req, res) => {
            const address = req.params.address;

            const balance = await this._walletManager.getBalance(address);
            res.send({
                balance: balance
            });
        });

        this.router.post('/sendCoins', async(req, res) => {

            const txData = {
                amount: req.body.amount,
                from: {
                    privateKey: req.body.from.privateKey,
                    publicKey: req.body.from.publicKey
                },
                to: req.body.to
            };

            let newTx;

            try {
                newTx = await this._walletManager.sendCoins(txData);

                res.json({
                    success: !!newTx,
                    transaction: newTx
                });
            } catch (error) {
                res.json({
                    error: {
                        message: error.message
                    }
                });
            }
        });
    }
}