import { TokenScanner } from '../../../src/core/engine/monitoring/tokenScanner';
import { mockSolana } from '../../fixtures';

describe('Token Monitoring', () => {
  const scanner = new TokenScanner(mockSolana.connection, mockSolana.raydium);

  it('should detect price changes', (done) => {
    scanner.onPriceChange((token, price) => {
      expect(token).toBe('SOL');
      expect(price).toBeGreaterThan(0);
      done();
    });
    
    scanner.watchToken('SOL');
  });
});