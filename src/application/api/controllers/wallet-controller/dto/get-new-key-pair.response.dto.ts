import { ApiModelProperty } from '@nestjs/swagger';
import { KeyPair } from '../../../../wallet/key-generator/key-pair';

export class GetNewKeyPairResponseDTO {
    @ApiModelProperty({ type: KeyPair })
    data: any;
}