export interface IConfiguration {
    rootPath: string;
    server: IServerConfiguration;
    p2p: IP2PConfiguration;
    creatorPublicAddress: string;
    storagePath: string;
}

export interface IServerConfiguration {
    host: string;
    port: number;
}

export interface IP2PConfiguration {
    host: string;
    port: number;
    peers: string[];
}