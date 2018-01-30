import { Injectable, Inject } from 'container-ioc';
import { BaseController } from "./base-controller";
import { TLogger } from "../../../system/logger/logger";
import { Controller } from "../controller.decorator";
import { Node } from '../../node';

@Controller({
    path: '/'
})
@Injectable([
    TLogger,
    Node
])
export class NodeController extends BaseController {
    constructor(
        @Inject(TLogger) logger,
        @Inject(Node) node
    ) {
        super();

        this._logger = logger;
        this._node = node;
    }

    init() {
        this.router.post('/sendTransaction', async (req, res) => {
            const address = req.body.address;
            const amount = req.body.amount;

            if (address === undefined || amount === undefined) {
                return res.status(400).end();
            }

            const result = await this._node.sendTransaction();

            res.json(result);
        });

        this.router.get('/mineBlock', (req, res) => {
            const minedBlock = this._node.mine();

            res.json({
                index: minedBlock.index,
                timeStamp: minedBlock.timeStamp,
                data: minedBlock.data,
                hash: minedBlock.hash
            });
        });

        this.router.get('/blocks', (req, res) => {
            const chain = this._node.getBlocks();
            res.json(chain);
        });
    }
}