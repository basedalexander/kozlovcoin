import { Component } from '@nestjs/common';
import { Transaction } from '../../transaction/classes/transaction';
import { TransactionUtilsService } from '../../transaction/services/transaction-utils.service';
import { TransactionOutput } from '../../transaction/classes/transaction-output';
import { TransactionReport } from './transaction-report';

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
    constructor(private txUtils: TransactionUtilsService) {
    }

    public convertForTxReportsForAddress(chainTxs: Transaction[], txPool: Transaction[], address: string): ITransactionReport[] {
        const confirmedReports: ITransactionReport[] = this.convertTxsToReports(chainTxs, address, true, chainTxs);

        const unconfirmedReports: ITransactionReport[] = this.convertTxsToReports(txPool, address, false, chainTxs);

        let reports: ITransactionReport[] = confirmedReports.concat(unconfirmedReports);

        reports = this.orderReports(reports);

        return reports;
    }

    private orderReports(reports: ITransactionReport[]): ITransactionReport[] {
        return reports.sort((a, b) => {
            return (b.timeStamp - a.timeStamp);
        });
    }

    private convertTxsToReports(transactions: Transaction[], address: string, confirmed: boolean, confirmedTxs: Transaction[]): ITransactionReport[] {
        const result: TransactionReport[] = [];

        transactions.forEach(tx => {
            const txOut: TransactionOutput = tx.outputs[1] ? tx.outputs[1] : tx.outputs[0];

            const recipientAddress: string = txOut.address;
            const senderAddress: string = this.getSenderAddress(recipientAddress, tx, transactions, confirmedTxs);

            if (recipientAddress !== address && senderAddress !== address) {
                return;
            }

            const type: TransactionReportType = (recipientAddress === address) ? TransactionReportType.Incoming : TransactionReportType.Outcoming;

            const report = new TransactionReport(
                tx.id,
                type,
                confirmed,
                tx.timeStamp,
                senderAddress,
                recipientAddress,
                txOut.amount
            );

            result.push(report);
        });

        return result;
    }

    private getSenderAddress(recipientAddress: string, tx: Transaction, transactions: Transaction[], confirmedTxs: Transaction[]): string {
        const senderAddress: string = '';

        if (this.txUtils.isCoinbaseTx(tx)) {
            return senderAddress;
        }

        for ( const input of tx.inputs) {
            const txId: string = input.txOutputId;

            let refTx: Transaction = transactions.find(t => t.id === txId);
            if (!refTx) {
                refTx = confirmedTxs.find(t => t.id === txId);
            }

            if (!refTx) { continue; }

            let guessingAddress: string;

            for (let i = refTx.outputs.length - 1; i >= 0; i--) {
                guessingAddress = refTx.outputs[i].address;
                if (guessingAddress !== recipientAddress) {
                    return guessingAddress;
                }
            }
        }

        return senderAddress;
    }
}