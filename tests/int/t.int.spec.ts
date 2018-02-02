import * as request from 'supertest';
import { app } from './../../src/s';

describe('Int tests', () => {
    let express;
    let server;

    beforeAll(() => {
        express = app;
        server = app.listen('3000');
    });

    afterAll(() => {
        server.close();
    });

    describe('should return json', () => {
        it('ok', async () => {
            const response = await request(app)
            .get('/')
            .set('Accept', 'application/json');

            expect(response.body.ok).toBe(1);
        });
    });
});