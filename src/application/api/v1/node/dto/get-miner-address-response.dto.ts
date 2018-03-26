import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponseDto } from '../../interfaces';

export class GetMinerAddressResponseDto implements IApiResponseDto {
    @ApiModelProperty()
    data: string;
}