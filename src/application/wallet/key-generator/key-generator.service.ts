import { Component } from '@nestjs/common';

import { ec } from 'elliptic';
import { KeyPair } from './key-pair';
const EC = new ec('secp256k1');

@Component()
export class KeyGeneratorService {
    public privateToPublic(privateKey: string): string {
        return EC.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex');
    }

    public generatePrivateKey(): string {
        const keyPair = EC.genKeyPair();
        const privateKey = keyPair.getPrivate();
        return privateKey.toString(16);
    }

    public generateKeyPair(): KeyPair {
        const privateKey: string = this.generatePrivateKey();
        const publicKey: string = this.privateToPublic(privateKey);

        return new KeyPair(publicKey, privateKey);
    }
}