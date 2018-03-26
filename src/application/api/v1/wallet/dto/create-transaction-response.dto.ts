import { ApiModelProperty } from '@nestjs/swagger';
import { Transaction } from '../../../../transaction/classes/transaction';
import { IApiResponseDto } from '../../interfaces';

export class MakeTransactionResponseDto implements IApiResponseDto {
    @ApiModelProperty({ type: Transaction })
    data: any;
}