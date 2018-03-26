import * as request from 'supertest';
import * as rimraf from 'rimraf-promise';
import accounts from '../../../helpers/test-accounts';

// tslint:disable
import { Server } from '../../../../src/server/server';
import { TransactionSendDetails } from '../../../helpers/transaction-send-details';

describe('Wallet REST API', () => {
    let server;
    let httpServer;

    beforeAll(async () => {
        server = new Server();

        await server.init();

        server.config.server.port = 3005;
        server.config.p2p.port = 6005;

        await rimraf(server.config.storagePath);

        await server.start();

        httpServer = server.getHttpServer();
    });

    afterAll(async () => {
        await server.stop();
    });

    describe('/api/v1/wallet/transactions/:{{publicKey}}', () => {
        it('should return proper list of incoming for an address', async () => {

            // 1) Sending 3 transaction to walletA
            const send1ToWalletARes = await request(httpServer)
                .post('/api/v1/wallet/transaction')
                .set('Accept', 'application/json')
                .send(new TransactionSendDetails(
                    accounts.walletA.publicKey,
                    accounts.genesis.publicKey,
                    accounts.genesis.privateKey,
                    1
                ));
            const send2ToWalletARes = await request(httpServer)
                .post('/api/v1/wallet/transaction')
                .set('Accept', 'application/json')
                .send(new TransactionSendDetails(
                    accounts.walletA.publicKey,
                    accounts.genesis.publicKey,
                    accounts.genesis.privateKey,
                    2
                ));
            const send3ToWalletARes = await request(httpServer)
                .post('/api/v1/wallet/transaction')
                .set('Accept', 'application/json')
                .send(new TransactionSendDetails(
                    accounts.walletA.publicKey,
                    accounts.genesis.publicKey,
                    accounts.genesis.privateKey,
                    3
                ));
            expect(send3ToWalletARes.status).toBe(200);

            const getWalletATxsResult = await request(httpServer)
                .get(`/api/v1/wallet/transactions/${accounts.walletA.publicKey}`)
                .set('Accept', 'application/json');

            expect(getWalletATxsResult.status).toBe(200);
            expect(getWalletATxsResult.body.data.length).toBe(3);

            const getGenesisWalletTxsResult = await request(httpServer)
                .get(`/api/v1/wallet/transactions/${accounts.genesis.publicKey}`)
                .set('Accept', 'application/json');
            expect(getGenesisWalletTxsResult.status).toBe(200);
            expect(getGenesisWalletTxsResult.body.data.length).toBe(4);

            // 2) Sending 2 transactions from walletA to walletB
            const send1ToWalletBRes = await request(httpServer)
                .post('/api/v1/wallet/transaction')
                .set('Accept', 'application/json')
                .send(new TransactionSendDetails(
                    accounts.walletB.publicKey,
                    accounts.walletA.publicKey,
                    accounts.walletA.privateKey,
                    1
                ));
            const send2ToWalletBRes = await request(httpServer)
                .post('/api/v1/wallet/transaction')
                .set('Accept', 'application/json')
                .send(new TransactionSendDetails(
                    accounts.walletB.publicKey,
                    accounts.walletA.publicKey,
                    accounts.walletA.privateKey,
                    1
                ));

            const getWalletATxsResult2 = await request(httpServer)
                .get(`/api/v1/wallet/transactions/${accounts.walletA.publicKey}`)
                .set('Accept', 'application/json');
            expect(getWalletATxsResult2.status).toBe(200);
            expect(getWalletATxsResult2.body.data.length).toBe(5);

            const getWalletBTxsResult2 = await request(httpServer)
                .get(`/api/v1/wallet/transactions/${accounts.walletB.publicKey}`)
                .set('Accept', 'application/json');
            expect(getWalletBTxsResult2.status).toBe(200);
            expect(getWalletBTxsResult2.body.data.length).toBe(2);
        }, 9000);
    });
});
