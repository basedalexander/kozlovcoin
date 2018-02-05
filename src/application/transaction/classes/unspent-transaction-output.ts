import { ApiModelProperty } from '@nestjs/swagger';

export class UnspentTransactionOutput {
    @ApiModelProperty()
    public txOutputId: string;

    @ApiModelProperty()
    public txOutputIndex: number;

    @ApiModelProperty()
    public address: string;

    @ApiModelProperty()
    public amount: number;

    constructor(
        txOutputId: string,
        txOutputIndex: number,
        address: string,
        amount: number
    ) {
        this.txOutputId = txOutputId;
        this.txOutputIndex = txOutputIndex;
        this.address = address;
        this.amount = amount;
    }
}