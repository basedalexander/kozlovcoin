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
        this.router.post('/sendTransaction', (req, res) => {
            this._node.addTransaction(req.body);
            res.end();
        });

        this.router.post('/mineTransaction', (req, res) => {
            const address = req.body.address;
            const amount = req.body.amount;
            const resp = {}; // todo add transaction to the transaction pool and mine a new block
            res.send(resp);
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