import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponseDto } from '../../interfaces';

export class GetBalanceResponseDTO implements IApiResponseDto {
    @ApiModelProperty()
    data: number;
}