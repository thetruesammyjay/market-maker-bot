import { MarketMakingStrategy } from '../../../src/core/engine/strategies/marketMaking';
import { mockSolana } from '../../fixtures';

describe('Market Making Strategy', () => {
  const strategy = new MarketMakingStrategy(mockSolana, {
    spreadPercent: 1,
    orderSize: 0.1,
    inventoryRatio: 0.5
  });

  it('should calculate bid/ask prices correctly', async () => {
    const midPrice = 100;
    const { bid, ask } = strategy.calculateSpread(midPrice);
    
    expect(bid).toBeCloseTo(99);
    expect(ask).toBeCloseTo(101);
  });

  it('should handle inventory skew', () => {
    strategy.updateInventory(0.8, 0.2); // 80% base, 20% quote
    const { bid, ask } = strategy.calculateSpread(100);
    
    // More aggressive bid when heavy on quote
    expect(bid).toBeGreaterThan(99);
    expect(ask).toBeGreaterThan(101);
  });
});