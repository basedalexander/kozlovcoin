import { Injectable, Inject} from "container-ioc";
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';
import mkdirp from 'mkdirp';

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const fileStatAsync = util.promisify(fs.stat);
const mkdirpAsync = util.promisify(mkdirp);

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
        if (!await this.isSaved()) {
            const dirPath = await this._createWalletDirPath();
            await mkdirp(dirPath);
        }

        const path = await this._createWalletFilePath();

        await writeFileAsync(path, walletData);
    }

    async get() {
        const path = await this._createWalletFilePath();
        return await readFileAsync(path);
    }

    async

    async isSaved() {
        const path = await this._createWalletFilePath();

        let stat;

        try {
            stat = await fileStatAsync(path);
        } catch (error) {
            return false;
        }

        return stat.isFile();
    }

    async _createWalletFilePath() {
        const userName = await this._getUserName();
        return path.join(this._config.storageDir, userName, this.WALLET_NAME);
    }

    async _createWalletDirPath() {
        const userName = await this._getUserName();
        return path.join(this._config.storageDir, userName);
    }

    // todo implement when sessions are included
    async _getUserName() {
        return 'default';
    }
}