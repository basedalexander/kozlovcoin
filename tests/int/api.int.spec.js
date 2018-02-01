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
            it('should return genesis block', async() => {
                const response = await request(app).get('/node/blocks');

                expect(response.statusCode).toBe(200);
            });
        });
    });
});
