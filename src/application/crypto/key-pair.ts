import { ApiModelProperty } from '@nestjs/swagger';

export class KeyPair {
    @ApiModelProperty()
    publicKey: string;

    @ApiModelProperty()
    privateKey: string;

    constructor(publicKey: string, privateKey: string) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
}