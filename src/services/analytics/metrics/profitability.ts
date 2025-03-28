import { TradeRecord } from '../../shared/types';

export class ProfitabilityCalculator {
    private tradeHistory: TradeRecord[] = [];

    constructor(tradeHistory: TradeRecord[] = []) {
        this.tradeHistory = tradeHistory;
    }

    get netProfit(): number {
        return this.tradeHistory.reduce(
            (sum, trade) => sum + (trade.profitLoss || 0), 0
        );
    }

    get grossProfit(): number {
        return this.tradeHistory.reduce(
            (sum, trade) => trade.profitLoss && trade.profitLoss > 0 ? sum + trade.profitLoss : sum, 0
        );
    }

    get grossLoss(): number {
        return this.tradeHistory.reduce(
            (sum, trade) => trade.profitLoss && trade.profitLoss < 0 ? sum + trade.profitLoss : sum, 0
        );
    }

    get profitFactor(): number {
        return Math.abs(this.grossProfit / this.grossLoss) || 0;
    }

    get winRate(): number {
        const winningTrades = this.tradeHistory.filter(
            trade => trade.profitLoss && trade.profitLoss > 0
        ).length;
        return winningTrades / this.tradeHistory.length || 0;
    }

    get averageProfitPerTrade(): number {
        return this.netProfit / this.tradeHistory.length || 0;
    }

    getSharpeRatio(riskFreeRate = 0): number {
        const returns = this.tradeHistory
            .filter(trade => trade.profitLoss !== undefined)
            .map(trade => trade.profitLoss!);
        
        if (returns.length === 0) return 0;

        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const stdDev = Math.sqrt(
            returns.map(x => Math.pow(x - avgReturn, 2)).reduce((a, b) => a + b) / returns.length
        );

        return stdDev !== 0 ? (avgReturn - riskFreeRate) / stdDev : 0;
    }
}