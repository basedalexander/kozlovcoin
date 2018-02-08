import { Component } from '@nestjs/common';

import * as crypto from 'crypto';
import * as ecdsa from 'elliptic';
import { toHexString } from '../../lib/utils';
import { KeyPair } from './key-pair';

@Component()
export class CryptoService {
    private ec = new ecdsa.ec('secp256k1');

    public createSHA256Hash(data: string): string {
        return crypto.createHash('sha256')
            .update(data)
            .digest('hex');
    }

    public signData(data: string, privateKey: string): string {
        const key = this.ec.keyFromPrivate(privateKey, 'hex');
        const signature = toHexString(key.sign(data).toDER());

        return signature;
    }

    public privateToPublic(privateKey: string): string {
        return this.ec.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex');
    }

    public generatePrivateKey(): string {
        const keyPair = this.ec.genKeyPair();
        const privateKey = keyPair.getPrivate();
        return privateKey.toString(16);
    }

    public generateKeyPair(): KeyPair {
        const privateKey: string = this.generatePrivateKey();
        const publicKey: string = this.privateToPublic(privateKey);

        return new KeyPair(publicKey, privateKey);
    }
}