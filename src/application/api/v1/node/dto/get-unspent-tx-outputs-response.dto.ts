import { ApiModelProperty } from '@nestjs/swagger';
import { UnspentTransactionOutput } from '../../../../transaction/classes/unspent-transaction-output';
import { IApiResponseDto } from '../../interfaces';

export class GetUnspentTxOutputsResponseDto implements IApiResponseDto {
    @ApiModelProperty({ type: UnspentTransactionOutput, isArray: true })
    data: any;
}