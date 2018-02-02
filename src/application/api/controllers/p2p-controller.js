import { Injectable, Inject } from 'container-ioc';
import { BaseController } from "./base-controller";
import { TLogger } from "../../../system/logger/logger";
import { Controller } from "../controller.decorator";
import {P2PNetwork} from "../../../p2p-network/p2p-network";

@Controller({
    path: '/p2p'
})
@Injectable([TLogger, P2PNetwork])
export class P2PController extends BaseController {
    constructor(
        @Inject(TLogger) logger,
        @Inject(P2PNetwork) p2p,
    ) {
        super();

        this._logger = logger;
        this._p2p = p2p;
    }

    init() {
        this.router.post('/peer', async(req, res) => {
            const peerUrl = req.body.url;

            const result = await this._p2p.addPeer(peerUrl);

            res.json({
                success: !!result
            });
        });
    }
}