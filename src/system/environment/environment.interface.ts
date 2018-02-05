export interface IEnvironment {
     config: EnvType;
     mode: EnvType;
     serverHost: string;
     serverPort: number;
     p2pHost: string;
     p2pPort: number;
     p2pPeers: string;
}

export type EnvType = 'staging'|'local'|'test';