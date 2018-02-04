import { Component } from '@nestjs/common';

import * as crypto from 'crypto';

@Component()
export class CryptoService {
    public createSHA256Hash(data: string): string {
        return crypto.createHash('sha256')
            .update(data)
            .digest('hex');
    }
}