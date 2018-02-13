import { ITransactionReport, TransactionReportType } from './transaction-converter.service';

export class TransactionReport implements ITransactionReport {
    constructor(
        public id: string,
        public type: TransactionReportType,
        public confirmed: boolean,
        public timeStamp: number,
        public from: string,
        public to: string,
        public amount: number

    ) {}
}