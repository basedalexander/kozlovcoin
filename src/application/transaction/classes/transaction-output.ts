import { ApiModelProperty } from '@nestjs/swagger';

export class TransactionOutput {
    @ApiModelProperty()
    public address: string;

    @ApiModelProperty()
    public amount: number;

    constructor(
        address: string,
        amount: number
    ) {
        this.address = address;
        this.amount = amount;
    }
}