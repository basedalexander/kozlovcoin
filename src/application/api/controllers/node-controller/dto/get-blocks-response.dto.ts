import { ApiModelProperty } from '@nestjs/swagger';
import { Block } from '../../../../block/block';

export class GetBlocksResponseDTO {
    @ApiModelProperty({ type: Block, isArray: true })
    data: any;
}