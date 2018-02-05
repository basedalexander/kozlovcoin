import { ApiModelProperty } from '@nestjs/swagger';
import { Transaction } from '../transaction/classes/transaction';

export class Block {
    @ApiModelProperty()
    public index: number;

    @ApiModelProperty()
    public timeStamp: number;

    @ApiModelProperty({ type: Transaction, isArray: true })
    public data: Transaction[];

    @ApiModelProperty()
    public previousBlockHash: string;

    @ApiModelProperty()
    public hash: string;

    @ApiModelProperty()
    public difficulty: number;

    @ApiModelProperty()
    public nonce: number;

    constructor(
        index: number,
        timeStamp: number,
        data: any,
        previousBlockHash: string,
        hash: string,
        difficulty: number,
        nonce: number
    ) {
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.previousBlockHash = previousBlockHash;
        this.hash = hash;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
}