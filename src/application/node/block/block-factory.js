import { Injectable, Inject } from "container-ioc";
import {Configuration} from "../../../bootstrap/configuration";
import {BlockUtilsService} from "./block-utils.service";
import {Block} from "./block";

@Injectable([
    Configuration,
    BlockUtilsService
])
export class BlockFactory {
    constructor(
        @Inject(Configuration) config,
        @Inject(BlockUtilsService) utils
    ) {
        this._config = config;
        this._utils = utils;
    }

    createGenesis(genesisTx) {
        const index = 0;
        const timeStamp = 1465154705;
        const data = [genesisTx];
        const previousBlockHash = '';

        const difficulty = 0;
        const nonce = 0;

        const hash = this._utils.calcBlockHash(
            index,
            timeStamp,
            data,
            previousBlockHash,
            difficulty,
            nonce
        );

        return new Block(
            index,
            timeStamp,
            data,
            previousBlockHash,
            hash,
            difficulty,
            nonce
        );
    }
}