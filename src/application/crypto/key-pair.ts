import { ApiModelProperty } from '@nestjs/swagger';

export class KeyPair {

    @ApiModelProperty()
    privateKey: string;

    @ApiModelProperty()
    publicKey: string;

    constructor(privateKey: string, publicKey: string) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
}