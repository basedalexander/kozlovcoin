import { Component } from '@nestjs/common';

import { CryptoService } from '../crypto/crypto.service';
import { IBlock } from './block.interface';

@Component()
export class BlockUtilsService {
    constructor(private crypto: CryptoService) {
    }

    public calcHashForBlock(block: IBlock) {
        const blockAsString: string = this.blockToString(block);
        return this.crypto.createSHA256Hash(blockAsString);
    }

    private blockToString(b: IBlock): string {
        return `${b.index}${b.timeStamp}${JSON.stringify(b.data)}${b.previousBlockHash}${b.difficulty}${b.nonce}`;
    }
}