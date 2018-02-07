import { ApiModelProperty } from '@nestjs/swagger';

export class GetBalanceResponseDTO {
    @ApiModelProperty()
    data: number;
}