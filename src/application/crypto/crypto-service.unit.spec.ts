import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
    const logger: any = {
        error: (...args) => {
            return;
        }
    };
    const service = new CryptoService(logger);

    const validPublicKey = '04eed216f7b94bcac693068eac125d62d9b1058621e834dac38a72fab1b8c370750ae66f7a15a042a2a7d851d54bd6de36402b2b8ce4e188f5833ba0294964cb88';
    const validPrivateKey = '9ae149506064ea5dacb347ca06be7572b2a719ccf7d4ec75f09c57885c86a0a3';

    describe('signMessage()', () => {
        it('should return signature ', () => {
            const message: string = '1235';
            const signature = service.signMessage(message, validPrivateKey);
            expect(typeof signature).toBe('string');
        });
    });

    describe('varifySignedMessage', () => {
        it('should verify message with signature and public key', () => {
            const message: string = '1235';
            const signature = service.signMessage(message, validPrivateKey);

            const verified: boolean = service.verifySignedMessage(message, signature, validPublicKey);
            expect(verified).toBe(true);
        });
    });

    describe('validatePublicKey()', () => {
        it('Should return true if key is valid', () => {
            const result: boolean = service.validatePublicKey(validPublicKey);
            expect(result).toBe(true);
        });

        it('Should return false if length is not qual to 130', () => {
            const result: boolean = service.validatePublicKey('123');
            expect(result).toBe(false);
        });

        it('Should return false if key doesnt start with 04', () => {
            const result: boolean = service
                .validatePublicKey('25a8185979beafadd8f9e4051c62de2eaf23a198f3826f38ea65507284b8df116040d2b6509af6fa5d5cfd93d92a9b23bea30e2866b8d1a1d565fb34f405ce678d');
            expect(result).toBe(false);
        });
    });

    describe('validatePrivateKey()', () => {
        it('Should return true if key is valid', () => {
            const result: boolean = service.validatePrivateKey(validPrivateKey);
            expect(result).toBe(true);
        });
    });

    describe('generatePrivateKey()', () => {
        it('should return hash hash string', () => {
            const key = service.generatePrivateKey();
            expect(typeof key).toBe('string');
        });
    });

    describe('createPublicFromPrivate()', () => {
        it('should return hash string with length 130', () => {
            const privateKey = service.generatePrivateKey();
            const publicKey = service.createPublicFromPrivate(privateKey);
            expect(publicKey.length).toBe(130);
        });

        it('should derived key should be compatible with private key', () => {
            const privateKey = service.generatePrivateKey();
            const publicKey = service.createPublicFromPrivate(privateKey);
            const secondlyCreatedPublicKey = service.createPublicFromPrivate(privateKey);

            expect(publicKey).toBe(secondlyCreatedPublicKey);
        });
    });

    describe('generateKeyPair()', () => {
        it('Generated keys should be compatible', () => {
            const keyPair = service.generateKeyPair();

            const privateKey = keyPair.privateKey;
            const publicKey = keyPair.publicKey;

            const derivedPublicKey = service.createPublicFromPrivate(privateKey);

            expect(publicKey).toBe(derivedPublicKey);
        });

        it('Old generated keys should be compatible', () => {
            const keyPair = service.generateKeyPair();

            const privateKey = keyPair.privateKey;
            const publicKey = keyPair.publicKey;

            const newService = new CryptoService(logger);

            const derivedPublicKey = newService.createPublicFromPrivate(privateKey);

            expect(publicKey).toBe(derivedPublicKey);
        });
    });

    describe('validateKeyPair()', () => {
        it('Should return false if at least one of the keys has wrong format', () => {
            const result: boolean = service.validateKeyPair(validPrivateKey, '123');
            expect(result).toBe(false);
        });

        it('case 1 Should return false if keys are not from the same key pair', () => {
            const anotherPublicKey = '0435185979beafadd8f9e4051c62de2eaf23a198f3826f38ea65507284b8df116040d2b6509af6fa5d5cfd93d92a9b23bea30e2866b8d1a1d565fb34f405ce678d';
            const result: boolean = service.validateKeyPair(validPrivateKey, anotherPublicKey);
            expect(result).toBe(false);
        });

        it('case 2Should return false if keys are not from the same key pair', () => {
            const anotherPrivateKey = 'sgadfbbd49173222d4657d5cc18bb89eae230242d3276d889be3fed8fde15d8e';
            const result: boolean = service.validateKeyPair(anotherPrivateKey, validPublicKey);
            expect(result).toBe(false);
        });

        it('should return true if keys are from the same key pair', () => {
            const keyPair = service.generateKeyPair();

            const result: boolean = service.validateKeyPair(validPrivateKey, validPublicKey);
            expect(result).toBe(true);
        });
    });
});