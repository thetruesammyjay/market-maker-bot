import { TradeRecord } from '../../shared/types';
import { ProfitabilityCalculator } from '../metrics/profitability';
import { RiskAssessor } from '../metrics/riskAssessment';
import { PerformanceAnalyzer } from '../metrics/performance';

export class DailyReporter {
    constructor(private tradeHistory: TradeRecord[]) {}

    generateReport(date: Date = new Date()) {
        const dateStr = date.toISOString().split('T')[0];
        const dailyTrades = this.tradeHistory.filter(
            trade => new Date(trade.timestamp).toISOString().split('T')[0] === dateStr
        );

        const profit = new ProfitabilityCalculator(dailyTrades);
        const risk = new RiskAssessor(dailyTrades);
        const perf = new PerformanceAnalyzer(dailyTrades);

        return {
            date: dateStr,
            summary: {
                totalTrades: dailyTrades.length,
                netProfit: profit.netProfit,
                winRate: profit.winRate,
                maxDrawdown: risk.maxDrawdown,
                riskOfRuin: risk.riskOfRuin,
                expectancy: perf.expectancy
            },
            detailedMetrics: {
                profitability: {
                    grossProfit: profit.grossProfit,
                    grossLoss: profit.grossLoss,
                    profitFactor: profit.profitFactor,
                    sharpeRatio: profit.getSharpeRatio()
                },
                risk: {
                    valueAtRisk95: risk.valueAtRisk(0.95),
                    valueAtRisk99: risk.valueAtRisk(0.99)
                },
                performance: {
                    winningStreak: perf.winningStreak,
                    losingStreak: perf.losingStreak,
                    kellyCriterion: perf.kellyCriterion
                }
            },
            trades: dailyTrades
        };
    }
}