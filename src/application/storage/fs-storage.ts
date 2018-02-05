import { Component } from '@nestjs/common';

import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import { IStorage } from './storage.interface';
import { Configuration } from '../../system/configuration';

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const fileStatAsync = util.promisify(fs.stat);
const existsAsync = util.promisify(fs.exists);

@Component()
export class FSStorage implements IStorage {
    constructor(private config: Configuration) {
    }

    async get(name: string): Promise<any> {
        const filePath: string = this.getFilePath(name);

        let result;

        try {
            result = await readFileAsync(filePath, 'utf8');
        } catch (error) {
            return null;
        }

        const desirealizedResult = JSON.parse(result);

        return desirealizedResult;
    }

    async set(name: string, data: any): Promise<void> {
        await this.ensureStorage();

        const filePath: string = this.getFilePath(name);
        const serialized: string = JSON.stringify(data);

        await writeFileAsync(filePath, serialized);
    }

    private async fileExists(name: string): Promise<boolean> {
        const filePath: string = this.getFilePath(name);

        let stat;

        try {
            stat = await fileStatAsync(filePath);
        } catch (error) {
            return false;
        }

        return stat.isFile();
    }

    private getFilePath(name: string): string {
        return path.join(this.config.storagePath, name);
    }

    private async ensureStorage(): Promise<void> {
        const dirPath = this.config.storagePath;

        const exists = await existsAsync(dirPath);

        if (!exists) {
            await mkdirp(dirPath);
        }
    }
}