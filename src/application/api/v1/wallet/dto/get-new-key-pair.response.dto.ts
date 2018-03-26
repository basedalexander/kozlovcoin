import { ApiModelProperty } from '@nestjs/swagger';
import { KeyPair } from '../../../../crypto/key-pair';
import { IApiResponseDto } from '../../interfaces';

export class GetKeyPairResponseDTO implements IApiResponseDto {
    @ApiModelProperty({ type: KeyPair })
    data: any;
}