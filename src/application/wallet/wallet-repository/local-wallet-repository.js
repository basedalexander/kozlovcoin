import { Injectable, Inject} from "container-ioc";
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

import { Configuration } from "../../../bootstrap/configuration";

@Injectable([
   Configuration
])
export class LocalWalletRepository {
    constructor(
        @Inject(Configuration) config
    ) {
        this._config = config.wallet;

        this.WALLET_NAME = 'private_key';
    }

    async save(walletData) {
        const path = await this._createWalletPath();
        await writeFileAsync(path, walletData);
    }

    async get() {
        const path = await this._createWalletPath();
        return await readFileAsync(path);
    }

    async _createWalletPath() {
        const userName = await this._getUserName();
        return path.join(this._config.storageDir, userName, this.WALLET_NAME);
    }

    // todo implement when sessions are included
    async _getUserName() {
        return 'default';
    }
}