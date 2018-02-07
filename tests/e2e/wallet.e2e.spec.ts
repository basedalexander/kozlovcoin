import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import * as rimraf from 'rimraf-promise';

// tslint:disable
const config = require('../../config/local-config.json');
import { configuration } from "../../src/system/configuration";
import { Server } from '../../src/server/server';

describe('Wallet REST API', async () => {
    let server;
    let httpServer;

    beforeAll(async () => {
        await rimraf(configuration.storagePath);
        server = new Server();

        await server.init();

        await server.start();

        httpServer = server.getHttpServerInstance();
    });

    beforeAll(async () => {
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

    describe('/wallet/transaction', () => {
        describe('POST', () => {
            it('Should add new transaction to the node and return it', async () => {
                const res = await request(httpServer)
                    .post('/wallet/transaction')
                    .set('Accept', 'application/json')
                    .send({
                        recipientPublicKey: '123',
                        senderPublicKey: config.creatorPublicAddress,
                        senderPrivateKey: config.creatorPrivateAddress,
                        amount: 20
                    });

                expect(res.body.data).toBeTruthy();

                expect(res.body.data.outputs[0].address).toBe(config.creatorPublicAddress);
                expect(res.body.data.outputs[0].amount).toBe(30);

                expect(res.body.data.outputs[1].address).toBe('123');
                expect(res.body.data.outputs[1].amount).toBe(20);
            });
        });

        it(`case #1 should return status 500 and error message if either of sender keys is wrong`, async () => {
            const res = await request(httpServer)
                .post('/wallet/transaction')
                .set('Accept', 'application/json')
                .send({
                    recipientPublicKey: '123',
                    senderPublicKey: config.creatorPublicAddress,
                    senderPrivateKey: 'wrongKey',
                    amount: 20
                });

            expect(res.body).toBeTruthy();
            expect(res.status).toBe(500);
            expect(typeof res.body.error).toBe('string');
        });

        it(`case #2 should return status 500 and error message if either of sender keys is wrong`, async () => {
            const res = await request(httpServer)
                .post('/wallet/transaction')
                .set('Accept', 'application/json')
                .send({
                    recipientPublicKey: '123',
                    senderPublicKey: 'bla',
                    senderPrivateKey: config.creatorPrivateAddress,
                    amount: 20
                });

            expect(res.body).toBeTruthy();
            expect(res.status).toBe(500);
            expect(typeof res.body.error).toBe('string');
        });


        describe('body validation', async () => {
            it(`case #1 should return status ${HttpStatus.BAD_REQUEST} if one of the fields has invalid type`, async () => {
                const res = await request(httpServer)
                    .post('/wallet/transaction')
                    .set('Accept', 'application/json')
                    .send({
                        recipientPublicKey: 123,
                        senderPublicKey: config.creatorPublicAddress,
                        senderPrivateKey: config.creatorPrivateAddress,
                        amount: 20
                    });

                expect(res.body).toBeTruthy();
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });

            it(`case #2 should return status ${HttpStatus.BAD_REQUEST} if one of the fields has invalid type`, async () => {
                const res = await request(httpServer)
                    .post('/wallet/transaction')
                    .set('Accept', 'application/json')
                    .send({
                        recipientPublicKey: '123',
                        senderPublicKey: 123,
                        senderPrivateKey: config.creatorPrivateAddress,
                        amount: 20
                    });

                expect(res.body).toBeTruthy();
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });

            it(`case #3 should return status ${HttpStatus.BAD_REQUEST} if one of the fields has invalid type`, async () => {
                const res = await request(httpServer)
                    .post('/wallet/transaction')
                    .set('Accept', 'application/json')
                    .send({
                        recipientPublicKey: '123',
                        senderPublicKey: config.creatorPublicAddress,
                        senderPrivateKey: 123,
                        amount: 20
                    });

                expect(res.body).toBeTruthy();
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });

            it(`case #4 should return status ${HttpStatus.BAD_REQUEST} if one of the fields has invalid type`, async () => {
                const res = await request(httpServer)
                    .post('/wallet/transaction')
                    .set('Accept', 'application/json')
                    .send({
                        recipientPublicKey: '123',
                        senderPublicKey: config.creatorPublicAddress,
                        senderPrivateKey: config.creatorPrivateAddress,
                        amount: '234'
                    });

                expect(res.body).toBeTruthy();
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
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
