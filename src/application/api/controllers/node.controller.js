import { Injectable, Inject } from 'container-ioc';
import { BaseController } from "./base-controller";
import { TLogger } from "../../../system/logger/logger";
import { Controller } from "../controller.decorator";
import { Node } from '../../node/node';
import {NodeManager} from "../../node/node-manager";

@Controller({
    path: '/node'
})
@Injectable([
    TLogger,
    Node,
    NodeManager
])
export class NodeController extends BaseController {
    constructor(
        @Inject(TLogger) logger,
        @Inject(Node) node,
        @Inject(NodeManager) nodeManager,
    ) {
        super();

        this._logger = logger;
        this._node = node;
        this._nodeManager = nodeManager;
    }

    init() {
        this.router.get('/status', async(req, res) => {
            const status = this._node.getStatus();
            res.json(status);
        });

        this.router.get('/mine', async(req, res) => {
            const result = await this._nodeManager.generateNewBlock();

            res.json(result);
        });

        this.router.get('/blocks', async(req, res) => {
            const blocks = await this._node.getBlocks();
            res.json(blocks);
        });

        this.router.get('/last_block', async(req, res) => {
            const block = await this._node.getLastBlock();
            res.json(block);
        });

        this.router.get('/utxouts', async(req, res) => {
            const unspentTransactionOutputs = await this._node.getUnspentTxOutputs();
            res.json(unspentTransactionOutputs);
        });

        this.router.get('/txpool', async(req, res) => {
            const txPool = await this._node.getTxPool();
            res.json(txPool);
        });
    }
}