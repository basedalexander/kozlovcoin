import * as request from 'supertest';
import * as rimraf from 'rimraf-promise';

import { configuration } from '../../src/system/configuration';
import { Server } from '../../src/server/server';

describe('Node REST API', async () => {
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

    describe('/blocks', () => {
        describe('GET', () => {
            it('Should return array', async () => {
                const res = await request(httpServer)
                    .get('/blocks')
                    .set('Accept', 'application/json');

                expect(res.body.data).toBeTruthy();
                expect(res.body.data instanceof Array).toBe(true);
            });

            it('Should return array with one item', async () => {
                const res = await request(httpServer)
                    .get('/blocks')
                    .set('Accept', 'application/json');

                expect(res.body.data.length).toBe(1);
            });

        });
    });

    describe('/last-block', () => {
        describe('GET', () => {
            it('Should return the only block in the chain', async () => {
                const res = await request(httpServer)
                    .get('/last-block')
                    .set('Accept', 'application/json');

                expect(res.body.data).toBeTruthy();
                expect(res.body.data).toMatchObject({
                    index: 0
                });
            });
        });
    });

    describe('/unspent-tx-outputs', () => {
        describe('GET', () => {
            it('Should return list of unspent transaction outputs', async () => {
                const res = await request(httpServer)
                    .get('/unspent-tx-outputs')
                    .set('Accept', 'application/json');

                expect(res.body.data).toBeTruthy();
                expect(res.body.data.length).toBe(1);
            });
        });
    });

    describe('/tx-pool', () => {
        describe('GET', () => {
            it('Should return list of uncofirmed transactions from Transaction pool', async () => {
                const res = await request(httpServer)
                    .get('/tx-pool')
                    .set('Accept', 'application/json');

                expect(res.body.data).toBeTruthy();
                expect(res.body.data.length).toBe(0);
            });
        });
    });
});
