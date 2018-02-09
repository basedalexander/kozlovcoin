/*tslint:disable quotemark object-literal-key-quotes*/

import { Server } from '../../src/server/server';
import { IServer } from '../../src/server/server.interface';
import * as request from 'supertest';
import { timer } from '../helpers/misc';

//tslint:disable

const HOST: string = 'localhost';

const nodeAConfig = {
    "server": {
        "host": HOST,
        "port": 4001
    },
    "p2p": {
        "host": HOST,
        "port": 6001,
        "peers": []
    }
};

const nodeBConfig = {
    "server": {
        "host": HOST,
        "port": 4002
    },
    "p2p": {
        "host": HOST,
        "port": 6002,
        "peers": []
    }
};

const nodeCConfig = {
    "server": {
        "host": HOST,
        "port": 4003
    },
    "p2p": {
        "host": HOST,
        "port": 6003,
        "peers": []
    }
};

describe('P2P Network Sync', () => {
    let serverA: IServer;
    let httpServerA;

    let serverB: IServer;
    let httpServerB;

    let serverC: IServer;
    let httpServerC;

    beforeAll(async () => {
        serverA = await startServer(nodeAConfig);
        httpServerA = serverA.getHttpServerInstance();

        serverB = await startServer(nodeBConfig);
        httpServerB = serverB.getHttpServerInstance();
        //
        serverC = await startServer(nodeCConfig);
        httpServerC = serverC.getHttpServerInstance();
    });

    afterAll(async () => {
        await stopServer(serverA);
        await stopServer(serverB);
        await stopServer(serverC);
    });

    describe('Peer registration', () => {
        it('A and B module should add each other in their peer lists when peer NodeB is added to NodeA', async() => {
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
});

const createWsAddressFromConfig = (config): string => {
    return `ws://${config.p2p.host}:${config.p2p.port}`;
};

const startServer = async (config): Promise<IServer> => {
    const server = new Server();

    await server.init();

    server.config.mode = 'local';
    server.config.server.host = config.server.host;
    server.config.server.port = config.server.port;

    server.config.p2p.host = config.p2p.host;
    server.config.p2p.port = config.p2p.port;
    server.config.p2p.peers = config.p2p.peers;

    await server.start();

    return server;
};

const stopServer = async (server: IServer): Promise<void> => {
    await server.stop();
};