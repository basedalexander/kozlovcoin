import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import * as rimraf from 'rimraf-promise';

// tslint:disable
import { Server } from '../../src/server/server';

describe('Wallet REST API', async () => {
    let server;
    let httpServer;

    beforeAll(async () => {
        server = new Server();

        await server.init();

        server.config.server.port = 3002;
        server.config.p2p.port = 6002;

        await rimraf(server.config.storagePath);

        await server.start();

        httpServer = server.getHttpServerInstance();
    });

    afterAll(async () => {
       await server.stop();
    });

    describe('/wallet/balance/{publicKey}', () => {
        describe('GET', () => {
            it('should return number of coins owned by given address', async () => {
                const res = await request(httpServer)
                    .get(`/wallet/balance/${server.config.genesisPublicKey}`)
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

            const recipientPublicKey: string = "0472d73e4d7d8770710ae2c2d1e6f4d837b4b94582ab723dbb725afdfd9ed630e9e6c51a4f89c7d12ce24ad385e192bdb5e1cc8f059da23536a685020fc18e5ea8";

            describe('Valid request', async () => {
                it('Should add new transaction to the node and return it', async () => {
                    const res = await request(httpServer)
                        .post('/wallet/transaction')
                        .set('Accept', 'application/json')
                        .send({
                            recipientPublicKey: recipientPublicKey,
                            senderPublicKey: server.config.genesisPublicKey,
                            senderPrivateKey: server.config.genesisPrivateKey,
                            amount: 20
                        });

                    expect(res.status).toBe(HttpStatus.OK);
                    expect(res.body).toBeTruthy();

                    expect(res.body.data.outputs[0].address).toBe(server.config.genesisPublicKey);
                    expect(res.body.data.outputs[0].amount).toBe(30);

                    expect(res.body.data.outputs[1].address).toBe(recipientPublicKey);
                    expect(res.body.data.outputs[1].amount).toBe(20);
                });
            });

            describe('Errors', async () => {
                it(`case #1 should return status 500 and error message if either of sender keys is wrong`, async () => {
                    const res = await request(httpServer)
                        .post('/wallet/transaction')
                        .set('Accept', 'application/json')
                        .send({
                            recipientPublicKey: recipientPublicKey,
                            senderPublicKey: server.config.genesisPublicKey,
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
                            recipientPublicKey: recipientPublicKey,
                            senderPublicKey: 'bla',
                            senderPrivateKey: server.config.genesisPrivateKey,
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
                                senderPublicKey: server.config.genesisPublicKey,
                                senderPrivateKey: server.config.genesisPrivateKey,
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
                                senderPrivateKey: server.config.genesisPrivateKey,
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
                                senderPublicKey: server.config.genesisPublicKey,
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
                                senderPublicKey: server.config.genesisPublicKey,
                                senderPrivateKey: server.config.genesisPrivateKey,
                                amount: '234'
                            });

                        expect(res.body).toBeTruthy();
                        expect(res.status).toBe(HttpStatus.BAD_REQUEST);
                    });
                });
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
