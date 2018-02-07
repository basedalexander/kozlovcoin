import { ApiModelProperty } from '@nestjs/swagger';
import { ICreateTransactionParamsInterface } from '../../create-transaction-params.interface';

export class MakeTransactionDto implements ICreateTransactionParamsInterface {

    @ApiModelProperty()
    recipientPublicKey: string;

    @ApiModelProperty()
    senderPublicKey: string;

    @ApiModelProperty()
    senderPrivateKey: string;

    @ApiModelProperty()
    amount: number;
}