import { TradeRecord } from '../shared/types';
import { ProfitabilityCalculator } from './metrics/profitability';
import { RiskAssessor } from './metrics/riskAssessment';
import { PerformanceAnalyzer } from './metrics/performance';
import { DailyReporter } from './reports/dailyReport';
import { TradeHistoryExporter } from './reports/tradeHistory';
import { DataVisualizer } from './reports/visualization';

export class AnalyticsService {
    private tradeHistory: TradeRecord[] = [];

    constructor(initialTrades: TradeRecord[] = []) {
        this.tradeHistory = initialTrades;
    }

    recordTrade(trade: TradeRecord): void {
        this.tradeHistory.push(trade);
    }

    get profitability(): ProfitabilityCalculator {
        return new ProfitabilityCalculator(this.tradeHistory);
    }

    get risk(): RiskAssessor {
        return new RiskAssessor(this.tradeHistory);
    }

    get performance(): PerformanceAnalyzer {
        return new PerformanceAnalyzer(this.tradeHistory);
    }

    get reporter(): DailyReporter {
        return new DailyReporter(this.tradeHistory);
    }

    get exporter(): TradeHistoryExporter {
        return new TradeHistoryExporter(this.tradeHistory);
    }

    get visualizer(): DataVisualizer {
        return new DataVisualizer(this.tradeHistory);
    }
}