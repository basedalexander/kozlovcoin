export class Block {
    constructor(
        public index: number,
        public timeStamp: number,
        public data: any,
        public previousBlockHash: string,
        public hash: string,
        public difficulty: number,
        public nonce: number
    ) {}
}