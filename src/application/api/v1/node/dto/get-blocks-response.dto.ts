import { ApiModelProperty } from '@nestjs/swagger';
import { Block } from '../../../../block/block';
import { IApiResponseDto } from '../../interfaces';

export class GetBlocksResponseDTO implements IApiResponseDto {
    @ApiModelProperty({ type: Block, isArray: true })
    data: any;
}