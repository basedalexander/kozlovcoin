import { Injectable, Inject } from "container-ioc";
import {Configuration} from "../../bootstrap/configuration";

@Injectable([
    Configuration
])
export class TransactionFactory {
    constructor(
        @Inject(Configuration) config,
        @Inject(BlockUtilsService) utils
    ) {
        this._config = config;
        this._utils = utils;
    }

    createGenesis(publicAddress, coinbaseAmount) {
        const tx = {
            inputs: [
                {
                    signature: '',
                    txOutputId: '',
                    txOutputIndex: 0
                }
            ],
            outputs: [
                {
                    address: publicAddress,
                    amount: coinbaseAmount
                }
            ]
        };

        tx.id = this._txUtilsService.calcTransactionId(tx);

        return tx;
    }
}