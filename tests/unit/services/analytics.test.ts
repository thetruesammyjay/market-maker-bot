import { AnalyticsService } from '../../../src/services/analytics';
import { sampleTrades } from '../../fixtures';

describe('Analytics Service', () => {
  const analytics = new AnalyticsService(sampleTrades);

  it('should calculate correct win rate', () => {
    expect(analytics.profitability.winRate).toBeCloseTo(0.6);
  });

  it('should identify max drawdown', () => {
    expect(analytics.risk.maxDrawdown).toBeCloseTo(150);
  });

  it('should generate valid reports', () => {
    const report = analytics.reporter.generateReport();
    expect(report.summary.totalTrades).toBe(sampleTrades.length);
  });
});