import { ApiModelProperty } from '@nestjs/swagger';
import { Transaction } from '../../../../transaction/classes/transaction';

export class MakeTransactionResponseDto {
    @ApiModelProperty({ type: Transaction })
    data: any;
}