import { APIService } from '../../../src/services/api';
import { mockConnection } from '../../fixtures';

describe('Rate Limiting Stress Test', () => {
  const api = new APIService(mockConnection);

  it('should handle 100 consecutive requests', async () => {
    const promises = Array(100).fill(0).map(() => 
      api.marketData.getMarketData('SOL-USDC')
    );
    
    const results = await Promise.all(promises);
    expect(results.length).toBe(100);
    expect(results.every(r => r.price > 0)).toBeTruthy();
  });
});