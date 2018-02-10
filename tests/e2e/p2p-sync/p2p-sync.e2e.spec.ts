/*tslint:disable quotemark object-literal-key-quotes*/

import { IServer } from '../../../src/server/server.interface';
import * as request from 'supertest';
import { timer } from '../../helpers/misc';
import accounts from './test-accounts';
import { nodeAConfig, nodeBConfig, nodeCConfig } from './node-configs';
import { startServer, stopServer, createWsAddressFromConfig } from './helpers';

describe('P2P Network Sync', () => {
    let serverA: IServer;
    let httpServerA;

    let serverB: IServer;
    let httpServerB;

    let serverC: IServer;
    let httpServerC;

    beforeEach(async () => {
        serverA = await startServer(nodeAConfig);
        httpServerA = serverA.getHttpServerInstance();

        serverB = await startServer(nodeBConfig);
        httpServerB = serverB.getHttpServerInstance();
        //
        serverC = await startServer(nodeCConfig);
        httpServerC = serverC.getHttpServerInstance();
    });

    afterEach(async () => {
        await stopServer(serverA);
        await stopServer(serverB);
        await stopServer(serverC);
    });

    describe('Peer adding', () => {
        it('A and B module should add each other in their peer lists when peer NodeB is added to NodeA', async () => {
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
            expect(getNodeAPeersResult.body.data[0]).toBe(nodeBAddress);

            const getNodeBPeersResult = await request(httpServerB)
                .get('/peers')
                .set('Accept', 'application/json');

            expect(getNodeBPeersResult.status).toBe(200);
            expect(typeof getNodeBPeersResult.body.data[0]).toBe('string');
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
                    senderPrivateKey: accounts.creator.privateKey,
                    senderPublicKey: accounts.creator.publicKey,
                    amount: 20
                });
            expect(sendTransactionToNodeAResult.status).toBe(200);

            const getNodeATxPoolResult2 = await request(httpServerA)
                .get('/tx-pool')
                .set('Accept', 'application/json');
            expect(getNodeATxPoolResult2.status).toBe(200);
            expect(getNodeATxPoolResult2.body.data.length).toBe(1);

            const getNodeBTxPoolResult = await request(httpServerA)
                .get('/tx-pool')
                .set('Accept', 'application/json');
            expect(getNodeBTxPoolResult.status).toBe(200);
            expect(getNodeBTxPoolResult.body.data.length).toBe(1);

            const nodeAPool = JSON.stringify(getNodeATxPoolResult2.body.data);
            const nodeBPool = JSON.stringify(getNodeBTxPoolResult.body.data);

            expect(nodeAPool === nodeBPool).toBe(true);
        });
    });
});
