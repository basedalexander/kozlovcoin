import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponseDto } from '../../interfaces';

export class GetHistoryResponseDTO implements IApiResponseDto {
    @ApiModelProperty({ isArray: true })
    data: any;
}