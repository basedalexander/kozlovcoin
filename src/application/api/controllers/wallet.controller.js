import { Injectable, Inject } from 'container-ioc';
import { BaseController } from "./base-controller";
import { TLogger } from "../../../system/logger/logger";
import { Controller } from "../controller.decorator";

@Controller({
    path: '/wallet'
})
@Injectable([TLogger])
export class WalletController extends BaseController {
    constructor(
        @Inject(TLogger) logger
    ) {
        super();

        this._logger = logger;
    }

    init() {
        this.router.get('/balance', (req, res) => {
            res.send({
                success: 'ok'
            });
        });

        this.router.post('/sendTransaction', (req, res) => {
            res.send({});
        });
    }
}