import { TransactionInput } from './transaction-input';
import { TransactionOutput } from './transaction-output';
import { ApiModelProperty } from '@nestjs/swagger';

export class Transaction {

    @ApiModelProperty()
    public id: string;

    @ApiModelProperty({ type: TransactionInput, isArray: true })
    public inputs: TransactionInput[];

    @ApiModelProperty({ type: TransactionOutput, isArray: true })
    public outputs: TransactionOutput[];

    constructor(
        id: string,
        inputs: TransactionInput[],
        outputs: TransactionOutput[]
    ) {
        this.id = id;
        this.inputs = inputs;
        this.outputs = outputs;
    }
}