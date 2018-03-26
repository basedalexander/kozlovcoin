import * as request from 'supertest';
import * as rimraf from 'rimraf-promise';

import { Server } from '../../../../src/server/server';
import { IBlock } from '../../../../src/application/block/block.interface';

describe('Node API v1', () => {
    let server;
    let httpServer;

    beforeAll(async () => {
        server = new Server();

        await server.init();

        server.config.server.port = 3001;
        server.config.p2p.port = 6001;

        await rimraf(server.config.storagePath);

        await server.start();

        httpServer = server.getHttpServer();
    });

    afterAll(async () => {
        await server.stop();
    });

    describe('/api/v1/blocks', () => {
        describe('GET', () => {
            it('Should return array', async () => {
                const res = await request(httpServer)
                    .get('/api/v1/blocks')
                    .set('Accept', 'application/json');

                expect(res.body.data).toBeTruthy();
                expect(res.body.data instanceof Array).toBe(true);
            });

            it('Should return array with one item', async () => {
                const res = await request(httpServer)
                    .get('/api/v1/blocks')
                    .set('Accept', 'application/json');

                expect(res.body.data.length).toBe(1);
            });

        });
    });

    describe('/api/v1/last-block', () => {
        describe('GET', () => {
            it('Should return the only block in the chain', async () => {
                const res = await request(httpServer)
                    .get('/api/v1/last-block')
                    .set('Accept', 'application/json');

                expect(res.body.data).toBeTruthy();
                expect(res.body.data).toMatchObject({
                    index: 0
                });
            });
        });
    });

    describe('/api/v1/unspent-tx-outputs', () => {
        describe('GET', () => {
            it('Should return list of unspent transaction outputs', async () => {
                const res = await request(httpServer)
                    .get('/api/v1/unspent-tx-outputs')
                    .set('Accept', 'application/json');

                expect(res.body.data).toBeTruthy();
                expect(res.body.data.length).toBe(1);
            });
        });
    });

    describe('/api/v1/tx-pool', () => {
        describe('GET', () => {
            it('Should return list of uncofirmed transactions from Transaction pool', async () => {
                const res = await request(httpServer)
                    .get('/api/v1/tx-pool')
                    .set('Accept', 'application/json');

                expect(res.body.data).toBeTruthy();
                expect(res.body.data.length).toBe(0);
            });
        });
    });

    describe('/api/v1/new-block', () => {
        describe('POST', async () => {
            let newBlock: IBlock;

            it('Should mine a new block with existing in tx pool transactions and return it', async () => {
                const res = await request(httpServer)
                    .post('/api/v1/new-block')
                    .set('Accept', 'application/json');

                expect(res.status).toBe(200);
                expect(typeof res.body.data.index).toBe('number');
                expect(typeof res.body.data.hash).toBe('string');

                newBlock = res.body.data;
            });

            it(`Should also properly update blockchain`, async () => {
                const res = await request(httpServer)
                    .get('/api/v1/last-block')
                    .set('Accept', 'application/json');

                expect(res.status).toBe(200);
                expect(res.body.data.index).toBe(newBlock.index);
                expect(res.body.data.hash).toBe(newBlock.hash);
            });

            it(`Should also properly update unspent-tx-outputs`, async () => {
                const res = await request(httpServer)
                    .get('/api/v1/unspent-tx-outputs')
                    .set('Accept', 'application/json');

                expect(res.status).toBe(200);
                expect(res.body.data.length).toBe(2);
            });
        });
    });
});
