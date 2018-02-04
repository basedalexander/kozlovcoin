import { ApiModelProperty } from '@nestjs/swagger';

export class Block {
    @ApiModelProperty()
    index: number;
}

export class GetBlocksResponseDTO {
    @ApiModelProperty({ type: Block, isArray: true })
    data: any;
}