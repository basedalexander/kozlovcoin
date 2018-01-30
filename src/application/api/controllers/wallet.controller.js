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
        this.router.get('/balance', (req, res) => {
            res.send({
                success: 'ok'
            });
        });

        this.router.post('/sendCoins', async(req, res) => {
            const success = await this._walletManager.sendCoins(req.body.address, req.body.amount);

            res.json({
                success: success
            });
        });
    }
}