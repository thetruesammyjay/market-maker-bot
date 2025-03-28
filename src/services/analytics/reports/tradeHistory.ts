import { TradeRecord } from '../../shared/types';
import { writeFileSync } from 'fs';
import { stringify } from 'csv-stringify/sync';

export class TradeHistoryExporter {
    constructor(private tradeHistory: TradeRecord[]) {}

    toCSV(filename: string): void {
        const csvData = this.tradeHistory.map(trade => ({
            Timestamp: new Date(trade.timestamp).toISOString(),
            Type: trade.type,
            Token: trade.token,
            Amount: trade.amount,
            Price: trade.price,
            'Profit/Loss': trade.profitLoss,
            'TX ID': trade.txId || ''
        }));

        const csvString = stringify(csvData, { header: true });
        writeFileSync(filename, csvString);
    }

    toJSON(filename: string): void {
        writeFileSync(filename, JSON.stringify(this.tradeHistory, null, 2));
    }

    filterByDate(start: Date, end: Date): TradeRecord[] {
        return this.tradeHistory.filter(trade => {
            const tradeDate = new Date(trade.timestamp);
            return tradeDate >= start && tradeDate <= end;
        });
    }

    filterByToken(token: string): TradeRecord[] {
        return this.tradeHistory.filter(trade => trade.token === token);
    }
}