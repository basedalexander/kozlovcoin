import { Component } from '@nestjs/common';
import { Transaction } from '../../transaction/classes/transaction';

export enum TransactionReportType {
    Incoming = 0,
    Outcoming = 1
}

export interface ITransactionReport {
    id: string;
    type: TransactionReportType;
    confirmed: boolean;
    timeStamp: number;
    from: string;
    to: string;
    amount;
}

@Component()
export class TransactionConverterService {
    public convertForTxReportsForAddress(chainTxs: Transaction[], txPool: Transaction[], address: string): ITransactionReport[] {
        const confirmedIncoming: ITransactionReport[] = this.getIncomingTransactions(chainTxs, address, true);
        const confirmedOutcoming: ITransactionReport[] = this.getOutcomingTransactions(chainTxs, address, true);

        const unconfirmedIncoming: ITransactionReport[] = this.getIncomingTransactions(chainTxs, address, false);
        const unconfirmedOutcoming: ITransactionReport[] = this.getOutcomingTransactions(chainTxs, address, false);

        let reports: ITransactionReport[] =
            confirmedIncoming
                .concat(confirmedOutcoming)
                .concat(unconfirmedIncoming)
                .concat(unconfirmedOutcoming);

        reports = this.orderReports(reports);

        return reports;

    }

    private orderReports(reports: ITransactionReport[]): ITransactionReport[] {
        return reports.sort((a, b) => a.timeStamp - b.timeStamp);
    }

    private getIncomingTransactions(transactions: Transaction[], address: string, confirmed: boolean): ITransactionReport[] {
        return [];
    }

    private getOutcomingTransactions(transactions: Transaction[], address: string, confirmed: boolean): ITransactionReport[] {
        return [];
    }
}