import { ApiModelProperty } from '@nestjs/swagger';
import { KeyPair } from '../../../../crypto/key-pair';

export class GetKeyPairResponseDTO {
    @ApiModelProperty({ type: KeyPair })
    data: any;
}