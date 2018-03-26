import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponseDto } from '../../interfaces';

export class GetPeersResponseDto implements IApiResponseDto {
    @ApiModelProperty({
        type: String,
        isArray: true,
        description: `["ws://example.com/ws", "ws://localhost:3008"]`
    })
    data: any;
}