import { TradeRecord } from '../../shared/types';

export class PerformanceAnalyzer {
    private tradeHistory: TradeRecord[] = [];

    constructor(tradeHistory: TradeRecord[] = []) {
        this.tradeHistory = tradeHistory;
    }

    get tradeCount(): number {
        return this.tradeHistory.length;
    }

    get winningStreak(): number {
        let current = 0;
        let max = 0;

        this.tradeHistory.forEach(trade => {
            if (trade.profitLoss && trade.profitLoss > 0) {
                current++;
                if (current > max) max = current;
            } else {
                current = 0;
            }
        });

        return max;
    }

    get losingStreak(): number {
        let current = 0;
        let max = 0;

        this.tradeHistory.forEach(trade => {
            if (trade.profitLoss && trade.profitLoss < 0) {
                current++;
                if (current > max) max = current;
            } else {
                current = 0;
            }
        });

        return max;
    }

    get expectancy(): number {
        const winRate = this.tradeHistory.filter(
            trade => trade.profitLoss && trade.profitLoss > 0
        ).length / this.tradeHistory.length || 0;

        const avgWin = this.tradeHistory.reduce(
            (sum, trade) => trade.profitLoss && trade.profitLoss > 0 ? sum + trade.profitLoss : sum, 0
        ) / this.tradeHistory.filter(trade => trade.profitLoss && trade.profitLoss > 0).length || 0;

        const avgLoss = this.tradeHistory.reduce(
            (sum, trade) => trade.profitLoss && trade.profitLoss < 0 ? sum + trade.profitLoss : sum, 0
        ) / this.tradeHistory.filter(trade => trade.profitLoss && trade.profitLoss < 0).length || 0;

        return (winRate * avgWin) - ((1 - winRate) * Math.abs(avgLoss));
    }

    get kellyCriterion(): number {
        const winRate = this.tradeHistory.filter(
            trade => trade.profitLoss && trade.profitLoss > 0
        ).length / this.tradeHistory.length || 0;

        const avgWin = this.tradeHistory.reduce(
            (sum, trade) => trade.profitLoss && trade.profitLoss > 0 ? sum + trade.profitLoss : sum, 0
        ) / this.tradeHistory.filter(trade => trade.profitLoss && trade.profitLoss > 0).length || 0;

        const avgLoss = this.tradeHistory.reduce(
            (sum, trade) => trade.profitLoss && trade.profitLoss < 0 ? sum + trade.profitLoss : sum, 0
        ) / this.tradeHistory.filter(trade => trade.profitLoss && trade.profitLoss < 0).length || 0;

        const payoffRatio = Math.abs(avgWin / avgLoss);
        return winRate - ((1 - winRate) / payoffRatio);
    }
}