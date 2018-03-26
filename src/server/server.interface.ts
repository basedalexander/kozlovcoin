import * as http from 'http';

export interface IServer {
    init(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    getHttpServer(): http.Server;
}