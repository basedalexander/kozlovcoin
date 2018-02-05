import { ApiModelProperty } from '@nestjs/swagger';
import { Transaction } from '../../../transaction/classes/transaction';

export class CreateTransactionResponseDto {
    @ApiModelProperty({ type: Transaction })
    data: any;
}