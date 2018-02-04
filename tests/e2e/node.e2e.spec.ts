import * as request from 'supertest';
import { bootstrap } from '../../src/bootstrap';

describe('Node REST API', () => {
    let server;
    let httpServer;

    beforeAll(async () => {
        server = await bootstrap();
        httpServer = server.getHttpServerInstance();
    });

    afterAll(async () => {
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

    xdescribe('/transaction', () => {
        describe('POST', () => {
            it('Should return success if transaction was added', async () => {
                const res = await request(httpServer)
                    .post('/transaction')
                    .set('Accept', 'application/json')
                    .send();

                expect(res.body.success).toBe(true);
            });
        });
    });
});
