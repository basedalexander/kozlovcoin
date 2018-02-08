import { ApiModelProperty } from '@nestjs/swagger';
import { KeyPair } from '../../../../crypto/key-pair';

export class GetNewKeyPairResponseDTO {
    @ApiModelProperty({ type: KeyPair })
    data: any;
}