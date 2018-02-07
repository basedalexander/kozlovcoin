import { ApiModelProperty } from '@nestjs/swagger';

export class ErrorResponseDTO {
    @ApiModelProperty()
    error: string;
}