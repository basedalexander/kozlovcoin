import { Component, Inject } from '@nestjs/common';

import * as crypto from 'crypto';
import * as ecdsa from 'elliptic';
import { toHexString } from '../../lib/utils';
import { KeyPair } from './key-pair';
import { ILogger, TLogger } from '../../system/logger/interfaces/logger.interface';

@Component()
export class CryptoService {
    private ec = new ecdsa.ec('secp256k1');

    constructor(@Inject(TLogger) private logger: ILogger) {}

    public createSHA256Hash(data: string): string {
        return crypto.createHash('sha256')
            .update(data)
            .digest('hex');
    }

    public signMessage(data: string, privateKey: string): string {
        const key = this.ec.keyFromPrivate(privateKey, 'hex');
        const signature = toHexString(key.sign(data).toDER());

        return signature;
    }

    public verifySignedMessage(message: string, signature: string, publicKey: string): boolean {
        const key = this.ec.keyFromPublic(publicKey, 'hex');
        return key.verify(message, signature);
    }

    public createPublicFromPrivate(privateKey: string): string {
        return this.ec.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex');
    }

    public generatePrivateKey(): string {
        const keyPair = this.ec.genKeyPair();
        const privateKey = keyPair.getPrivate();
        return privateKey.toString(16);
    }

    public generateKeyPair(): KeyPair {
        const privateKey: string = this.generatePrivateKey();
        const publicKey: string = this.createPublicFromPrivate(privateKey);

        return new KeyPair(privateKey, publicKey);
    }

    public validatePublicKey(key: string): boolean {
        if (!key) {
            return false;
        } else if (key.length !== 130) {
            this.logger.error(key);
            this.logger.error('invalid public key length');
            return false;
        } else if (key.match('^[a-fA-F0-9]+$') === null) {
            this.logger.error('public key must contain only hex characters');
            return false;
        } else if (!key.startsWith('04')) {
            this.logger.error('public key must start with 04');
            return false;
        }

        return true;
    }

    public validatePrivateKey(key: string): boolean {
        if (!key) {
            return false;
        }

        return true;
    }

    public validateKeyPair(privateKey: string, publicKey: string): boolean {
        if (!this.validatePrivateKey(privateKey) || !this.validatePublicKey(publicKey)) {
            return false;
        }

        const derivedPk: string = this.createPublicFromPrivate(privateKey);

        if (derivedPk !== publicKey) {
            return false;
        }

        return true;
    }
}