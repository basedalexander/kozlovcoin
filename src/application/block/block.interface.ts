export interface IBlock {
    index: number;
    timeStamp: number;
    data: any; // todo
    previousBlockHash: string;
    hash: string;
    difficulty: number;
    nonce: number;
}