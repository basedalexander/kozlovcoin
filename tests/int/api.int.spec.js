import request from 'supertest';

describe('NODE REST API', () => {

    let server;
    let app;

    beforeAll(() => {
        server = require('../../src/index').server;
        app = server.getExpress();
    });

    afterAll(() => {
        server.stop();
    });

    describe('/node/blocks', () => {
        describe('GET', () => {
            it('Should return array of blocks', async() => {
                const response = await request(app)
                    .get('/node/blocks')
                    .set('Accept', 'application/json');

                expect(response.body.data.length).toBe(1);
            });

            it('The first block should be with index 0', async() => {
                const response = await request(app)
                    .get('/node/blocks')
                    .set('Accept', 'application/json');

                expect(response.body.data[0].index).toBe(0);
            });
        });
    });

    describe('/node/last_block', () => {
        describe('GET', () => {
            it('Should return the latest block', async() => {
                const response = await request(app)
                    .get('/node/last_block')
                    .set('Accept', 'application/json');

                expect(response.body.data.index).toBe(0);
            });
        });
    });
});
