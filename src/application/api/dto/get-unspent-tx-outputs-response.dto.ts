import { ApiModelProperty } from '@nestjs/swagger';
import { UnspentTransactionOutput } from '../../transaction/classes/unspent-transaction-output';

export class GetUnspentTxOutputsResponseDto {
    @ApiModelProperty({ type: UnspentTransactionOutput, isArray: true })
    data: any;
}