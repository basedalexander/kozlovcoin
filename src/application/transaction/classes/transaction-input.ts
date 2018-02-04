import { ApiModelProperty } from '@nestjs/swagger';

export class TransactionInput {
    @ApiModelProperty()
    public txOutputId: string;

    @ApiModelProperty()
    public txOutputIndex: number;

    @ApiModelProperty()
    public signature: string;

    constructor(
        txOutputId: string,
        txOutputIndex: number,
        signature: string
    ) {
        this.txOutputId = txOutputId;
        this.txOutputIndex = txOutputIndex;
        this.signature = signature;
    }
}