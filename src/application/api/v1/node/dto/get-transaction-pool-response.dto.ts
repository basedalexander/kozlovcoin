import { ApiModelProperty } from '@nestjs/swagger';
import { Transaction } from '../../../../transaction/classes/transaction';
import { IApiResponseDto } from '../../interfaces';

export class GetTransactionPoolResponseDto implements IApiResponseDto {
    @ApiModelProperty({ type: Transaction, isArray: true, required: false })
    data: any;
}