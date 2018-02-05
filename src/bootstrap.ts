import { Server } from './server/server';
import { IServer } from './server/server.interface';

export const bootstrap = async (): Promise<IServer> => {
    const server: IServer = new Server();

    await server.init();

    await server.start();

    return server;
};