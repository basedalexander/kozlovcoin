import { ApiModelProperty } from '@nestjs/swagger';
import { Block } from '../../block/block';

export class GetLastBlockResponseDTO {
    @ApiModelProperty({ type: Block })
    data: any;
}