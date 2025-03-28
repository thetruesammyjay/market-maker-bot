import { ArbitrageStrategy } from '../../../src/core/engine/strategies/arbitrage';
import { mockSolana } from '../../fixtures';

describe('Arbitrage Strategy', () => {
  const strategy = new ArbitrageStrategy(mockSolana);

  it('should identify profitable opportunities', () => {
    const prices = {
      raydium: 100,
      orca: 102,
      saber: 99
    };
    
    const opportunity = strategy.findBestOpportunity(prices);
    expect(opportunity.profit).toBeGreaterThan(0);
    expect(opportunity.direction).toBe('raydium-to-orca');
  });

  it('should filter unprofitable trades', () => {
    const prices = {
      raydium: 100,
      orca: 100.5
    };
    
    strategy.config.minProfitabilityBps = 10; // 0.1%
    const opportunity = strategy.findBestOpportunity(prices);
    expect(opportunity).toBeNull();
  });
});