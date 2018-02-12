import { ApiModelProperty } from '@nestjs/swagger';

export class GetMinerAddressResponseDto {
    @ApiModelProperty()
    data: string;
}