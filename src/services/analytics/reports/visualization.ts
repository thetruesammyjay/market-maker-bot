import { TradeRecord } from '../../shared/types';
import { Plot } from 'nodeplotlib';
import { ProfitabilityCalculator } from '../metrics/profitability';

interface ChartConfig {
    width?: number;
    height?: number;
    title?: string;
    xAxisTitle?: string;
    yAxisTitle?: string;
}

export class DataVisualizer {
    constructor(private tradeHistory: TradeRecord[]) {}

    plotProfitOverTime(config?: ChartConfig): void {
        const dates: Date[] = [];
        const cumulativeProfit: number[] = [];
        let runningTotal = 0;

        this.tradeHistory
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .forEach(trade => {
                dates.push(new Date(trade.timestamp));
                runningTotal += trade.profitLoss || 0;
                cumulativeProfit.push(runningTotal);
            });

        const plotData: Plot[] = [{
            x: dates,
            y: cumulativeProfit,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Cumulative Profit'
        }];

        const layout = {
            title: config?.title || 'Profit Over Time',
            xaxis: { title: config?.xAxisTitle || 'Date' },
            yaxis: { title: config?.yAxisTitle || 'Profit (USD)' },
            width: config?.width,
            height: config?.height
        };

        require('nodeplotlib').plot(plotData, layout);
    }

    plotWinLossDistribution(config?: ChartConfig): void {
        const profitCalc = new ProfitabilityCalculator(this.tradeHistory);
        const winRate = profitCalc.winRate;

        const plotData: Plot[] = [{
            values: [winRate, 1 - winRate],
            labels: ['Winning Trades', 'Losing Trades'],
            type: 'pie',
            textinfo: 'percent+label'
        }];

        const layout = {
            title: config?.title || 'Win/Loss Distribution',
            width: config?.width,
            height: config?.height
        };

        require('nodeplotlib').plot(plotData, layout);
    }
}