import { ApiModelProperty } from '@nestjs/swagger';

export class GetPeersResponseDto {
    @ApiModelProperty({
        type: String,
        isArray: true,
        description: `["ws://example.com/ws", "ws://localhost:3008"]`
    })
    data: any;
}