/*tslint:disable quotemark object-literal-key-quotes*/

import { IServer } from '../../../src/server/server.interface';
import * as request from 'supertest';
import { timer } from '../../helpers/misc';
import accounts from '../../helpers/test-accounts';
import { nodeAConfig, nodeBConfig, nodeCConfig } from './node-configs';
import { startServer, stopServer, createWsAddressFromConfig } from './helpers';

describe('P2P Network Sync', () => {
    let serverA: IServer;
    let httpServerA;

    let serverB: IServer;
    let httpServerB;

    beforeEach(async () => {
        serverA = await startServer(nodeAConfig);
        httpServerA = serverA.getHttpServerInstance();

        serverB = await startServer(nodeBConfig);
        httpServerB = serverB.getHttpServerInstance();
    });

    afterEach(async () => {
        await stopServer(serverA);
        await stopServer(serverB);
    });

    describe('Peer adding', () => {
        it(`Node_A and Node_B should add each other as peers after NodeB is added to NodeA's peer list`, async () => {
            const nodeBAddress: string = createWsAddressFromConfig(nodeBConfig);

            const addPeerToNodeAResult = await request(httpServerA)
                .post('/peer')
                .set('Accept', 'application/json')
                .send({
                    address: nodeBAddress
                });

            expect(addPeerToNodeAResult.status).toBe(200);

            await timer(1000);

            const getNodeAPeersResult = await request(httpServerA)
                .get('/peers')
                .set('Accept', 'application/json');

            expect(getNodeAPeersResult.status).toBe(200);
            expect(getNodeAPeersResult.body.data.length).toBe(1);

            const getNodeBPeersResult = await request(httpServerB)
                .get('/peers')
                .set('Accept', 'application/json');

            expect(getNodeBPeersResult.status).toBe(200);
            expect(getNodeBPeersResult.body.data.length).toBe(1);
        });
    });

    describe('Transaction Pool Synchronization amoungst peers', () => {
        it('A and B nodes should sync tx pool', async () => {

            const nodeBAddress: string = createWsAddressFromConfig(nodeBConfig);
            const addPeerToNodeAResult = await request(httpServerA)
                .post('/peer')
                .set('Accept', 'application/json')
                .send({
                    address: nodeBAddress
                });
            expect(addPeerToNodeAResult.status).toBe(200);

            const getNodeATxPoolResult = await request(httpServerA)
                .get('/tx-pool')
                .set('Accept', 'application/json');
            expect(getNodeATxPoolResult.status).toBe(200);
            expect(getNodeATxPoolResult.body.data.length).toBe(0);

            const sendTransactionToNodeAResult = await request(httpServerA)
                .post('/wallet/transaction')
                .set('Accept', 'application/json')
                .send({
                    recipientPublicKey: accounts.walletA.publicKey,
                    senderPrivateKey: accounts.genesis.privateKey,
                    senderPublicKey: accounts.genesis.publicKey,
                    amount: 20
                });
            expect(sendTransactionToNodeAResult.status).toBe(200);

            const getNodeATxPoolResult2 = await request(httpServerA)
                .get('/tx-pool')
                .set('Accept', 'application/json');
            expect(getNodeATxPoolResult2.status).toBe(200);
            expect(getNodeATxPoolResult2.body.data.length).toBe(1);

            const getNodeBTxPoolResult = await request(httpServerB)
                .get('/tx-pool')
                .set('Accept', 'application/json');
            expect(getNodeBTxPoolResult.status).toBe(200);
            expect(getNodeBTxPoolResult.body.data.length).toBe(1);

            const nodeAPool = JSON.stringify(getNodeATxPoolResult2.body.data);
            const nodeBPool = JSON.stringify(getNodeBTxPoolResult.body.data);

            expect(nodeAPool === nodeBPool).toBe(true);
        });
    });

    describe('Peers sync after mining a new block', () => {
        it(`After node A has mined a new block, block B should update its blockchain, uTxOuts and tx pool`, async () => {

            const nodeBAddress: string = createWsAddressFromConfig(nodeBConfig);
            const addPeerToNodeAResult = await request(httpServerA)
                .post('/peer')
                .set('Accept', 'application/json')
                .send({
                    address: nodeBAddress
                });
            expect(addPeerToNodeAResult.status).toBe(200);

            const getNodeATxPoolResult = await request(httpServerA)
                .get('/tx-pool')
                .set('Accept', 'application/json');
            expect(getNodeATxPoolResult.status).toBe(200);
            expect(getNodeATxPoolResult.body.data.length).toBe(0);

            const sendTransactionToNodeAResult = await request(httpServerA)
                .post('/wallet/transaction')
                .set('Accept', 'application/json')
                .send({
                    recipientPublicKey: accounts.walletA.publicKey,
                    senderPrivateKey: accounts.genesis.privateKey,
                    senderPublicKey: accounts.genesis.publicKey,
                    amount: 20
                });
            expect(sendTransactionToNodeAResult.status).toBe(200);

            const nodeAMineBlockResult = await request(httpServerA)
                .post('/new-block')
                .set('Accept', 'application/json');
            expect(nodeAMineBlockResult.status).toBe(200);

            const nodeALastBlockResponse = await request(httpServerA)
                .get('/last-block')
                .set('Accept', 'application/json');
            expect(nodeALastBlockResponse.status).toBe(200);

            await timer(1000);

            const nodeBLastBlockResponse = await request(httpServerB)
                .get('/last-block')
                .set('Accept', 'application/json');
            expect(nodeBLastBlockResponse.status).toBe(200);
            expect(nodeBLastBlockResponse.body.data).toMatchObject(nodeALastBlockResponse.body.data);

            const nodeBTxPoolResponse = await request(httpServerB)
                .get('/tx-pool')
                .set('Accept', 'application/json');
            expect(nodeBTxPoolResponse.status).toBe(200);
            expect(nodeBTxPoolResponse.body.data.length).toBe(0);

            const nodeAUTxResponse = await request(httpServerA)
                .get('/unspent-tx-outputs')
                .set('Accept', 'application/json');
            expect(nodeAUTxResponse.status).toBe(200);

            const nodeBUTxResponse = await request(httpServerB)
                .get('/unspent-tx-outputs')
                .set('Accept', 'application/json');
            expect(nodeBTxPoolResponse.status).toBe(200);

            expect(JSON.stringify(nodeAUTxResponse.body.data)).toBe(JSON.stringify(nodeBUTxResponse.body.data));
        });
    });
});
