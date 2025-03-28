import { MarketDataService } from '../../../src/services/api/marketData';
import { mockConnection } from '../../fixtures';

describe('Market Data Service', () => {
  const service = new MarketDataService(mockConnection);

  it('should cache market data', async () => {
    const data1 = await service.getMarketData('SOL-USDC');
    const data2 = await service.getMarketData('SOL-USDC');
    expect(data1).toEqual(data2);
  });

  it('should refresh cache after TTL', async () => {
    jest.useFakeTimers();
    const data1 = await service.getMarketData('SOL-USDC');
    jest.advanceTimersByTime(30000);
    const data2 = await service.getMarketData('SOL-USDC');
    expect(data1).not.toEqual(data2);
    jest.useRealTimers();
  });
});