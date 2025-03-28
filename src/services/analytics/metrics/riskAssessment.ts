import { TradeRecord } from '../../shared/types';

export class RiskAssessor {
    private tradeHistory: TradeRecord[] = [];

    constructor(tradeHistory: TradeRecord[] = []) {
        this.tradeHistory = tradeHistory;
    }

    get maxDrawdown(): number {
        let peak = 0;
        let maxDrawdown = 0;
        let runningBalance = 0;

        this.tradeHistory.forEach(trade => {
            runningBalance += trade.profitLoss || 0;
            if (runningBalance > peak) peak = runningBalance;
            const drawdown = peak - runningBalance;
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        });

        return maxDrawdown;
    }

    get riskOfRuin(): number {
        const winRate = this.tradeHistory.filter(
            trade => trade.profitLoss && trade.profitLoss > 0
        ).length / this.tradeHistory.length || 0;

        const avgWin = this.tradeHistory.reduce(
            (sum, trade) => trade.profitLoss && trade.profitLoss > 0 ? sum + trade.profitLoss : sum, 0
        ) / this.tradeHistory.filter(trade => trade.profitLoss && trade.profitLoss > 0).length || 1;

        const avgLoss = this.tradeHistory.reduce(
            (sum, trade) => trade.profitLoss && trade.profitLoss < 0 ? sum + trade.profitLoss : sum, 0
        ) / this.tradeHistory.filter(trade => trade.profitLoss && trade.profitLoss < 0).length || 1;

        const payoffRatio = Math.abs(avgWin / avgLoss);
        return Math.pow(
            (1 - winRate) / (1 + payoffRatio - winRate),
            (avgWin / avgLoss) * (1 / winRate - 1)
        ) * 100;
    }

    get valueAtRisk(confidenceLevel = 0.95): number {
        const returns = this.tradeHistory
            .filter(trade => trade.profitLoss !== undefined)
            .map(trade => trade.profitLoss!);
        
        if (returns.length === 0) return 0;

        const sortedReturns = [...returns].sort((a, b) => a - b);
        const index = Math.floor((1 - confidenceLevel) * sortedReturns.length);
        return sortedReturns[index];
    }
}