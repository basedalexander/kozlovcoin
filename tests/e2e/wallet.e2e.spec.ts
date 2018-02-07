import * as request from 'supertest';
import { bootstrap } from '../../src/bootstrap';
import * as rimraf from 'rimraf-promise';

// tslint:disable
const config = require('../../config/local-config.json');
import { configuration } from "../../src/system/configuration";

describe('Wallet REST API', () => {
    let server;
    let httpServer;

    beforeAll(async () => {
        await rimraf(configuration.storagePath);
        server = await bootstrap();
        httpServer = server.getHttpServerInstance();
    });

    afterAll(async () => {
        await server.stop();
    });

    describe('/wallet/balance/{publicKey}', () => {
        describe('GET', () => {
            it('should return number of coins owned by given address', async () => {
                const res = await request(httpServer)
                    .get(`/wallet/balance/${config.creatorPublicAddress}`)
                    .set('Accept', 'application/json');

                expect(res.body.data).toBe(50);
            });

            it('should return zero number of coins if theres nothing owned by given address', async () => {
                const res = await request(httpServer)
                    .get('/wallet/balance/123')
                    .set('Accept', 'application/json');

                expect(res.body.data).toBe(0);
            });
        });
    });

    xdescribe('/wallet/transaction', () => {
        describe('POST', () => {
            it('Should add new transaction to the node and return it', async () => {
                const res = await request(httpServer)
                    .post('/wallet/transaction')
                    .set('Accept', 'application/json')
                    .send({
                        recipientPublicKey: "123",
                        senderPublicKey: config.creatorPublicAddress,
                        senderPrivateKey: config.creatorPrivateAddress,
                        amount: 20
                    });

                expect(res.body.data).toBeTruthy();
                expect(res.body.data instanceof Array).toBe(true);
            });
        });
    });



    describe('/wallet/new-key-pair', () => {
        describe('GET', () => {
            it('Should return new pair of keys, private and public', async () => {
                const res = await request(httpServer)
                    .get(`/wallet/new-key-pair`)
                    .set('Accept', 'application/json');

                expect(res.body.data).toBeTruthy();
                expect(typeof res.body.data.publicKey).toBe('string');
                expect(typeof res.body.data.privateKey).toBe('string');
            });
        });
    });
});
