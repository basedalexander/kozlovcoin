import { ApiModelProperty } from '@nestjs/swagger';
import { ICreateTransactionParams } from '../../../../wallet/create-transaction-params.interface';
import { IsNumber, IsString } from 'class-validator';

export class MakeTransactionDto implements ICreateTransactionParams {

    @ApiModelProperty()
    @IsString()
    recipientPublicKey: string;

    @ApiModelProperty()
    @IsString()
    senderPublicKey: string;

    @ApiModelProperty()
    @IsString()
    senderPrivateKey: string;

    @ApiModelProperty()
    @IsNumber()
    amount: number;
}