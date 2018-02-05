import { ApiModelProperty } from '@nestjs/swagger';
import { KeyPair } from '../../key-generator/key-pair';

export class GetNewKeyPairResponseDTO {
    @ApiModelProperty({ type: KeyPair })
    data: any;
}