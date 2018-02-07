import { ApiModelProperty } from '@nestjs/swagger';
import { Transaction } from '../../../../transaction/classes/transaction';

export class GetTransactionPoolResponseDto {
    @ApiModelProperty({ type: Transaction, isArray: true, required: false })
    data: any;
}