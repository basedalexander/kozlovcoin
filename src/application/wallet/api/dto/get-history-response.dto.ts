import { ApiModelProperty } from '@nestjs/swagger';

export class GetHistoryResponseDTO {
    @ApiModelProperty({ isArray: true })
    data: any;
}