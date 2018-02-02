
export interface IServer {
    init(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    getHttpServerInstance(): Express.Application;
}