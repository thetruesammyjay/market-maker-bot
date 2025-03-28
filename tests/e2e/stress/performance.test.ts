import { ArbitrageStrategy } from '../../../src/core/engine/strategies/arbitrage';
import { mockSolana } from '../../fixtures';

describe('Performance Benchmark', () => {
  const strategy = new ArbitrageStrategy(mockSolana);
  
  it('should process 1000 opportunities under 1s', async () => {
    const start = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      strategy.findBestOpportunity({
        raydium: 100 + Math.random(),
        orca: 100 + Math.random()
      });
    }
    
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(1000);
  });
});