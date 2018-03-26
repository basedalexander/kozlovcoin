import { ApiModelProperty } from '@nestjs/swagger';
import { Block } from '../../../../block/block';
import { IApiResponseDto } from '../../interfaces';

export class GetLastBlockResponseDTO implements IApiResponseDto {
    @ApiModelProperty({ type: Block })
    data: any;
}