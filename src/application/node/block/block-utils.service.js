import { Injectable, Inject } from "container-ioc";
import crypto from 'crypto';

@Injectable()
export class BlockUtilsService {
    calcBlockHash(index, timeStamp, data, previousBlockHash, difficulty, nonce) {
        const hash = crypto.createHash('sha256');

        return hash
            .update(`${index}`)
            .update(`${timeStamp}`)
            .update(`${JSON.stringify(data)}`)
            .update(`${previousBlockHash}`)
            .update(`${difficulty}`)
            .update(`${nonce}`)
            .digest('hex');
    }

    calcHashForBlock(block) {
        return this.calcBlockHash(
            block.index,
            block.timeStamp,
            block.data,
            block.previousBlockHash,
            block.difficulty,
            block.nonce
        )
    }
}