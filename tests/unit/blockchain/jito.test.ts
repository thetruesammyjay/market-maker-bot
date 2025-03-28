import { JitoSearcher } from '../../../src/core/blockchain/jito/searcherClient';
import { mockConnection } from '../../fixtures';
import { ServiceErrorHandler } from '../../../src/utils/errorHandlers';

describe('Jito MEV Service', () => {
  let searcher: JitoSearcher;

  beforeAll(() => {
    searcher = new JitoSearcher(
      'https://jito-api.example.com',
      'test-auth-key',
      mockConnection
    );
  });

  describe('Bundle Submission', () => {
    it('should successfully submit bundle', async () => {
      const mockBundle = { transactions: [] };
      const result = await searcher.sendBundle(mockBundle);
      expect(result).toMatch(/^bundle_[a-zA-Z0-9]{24}$/);
    });

    it('should handle submission errors', async () => {
      jest.spyOn(searcher, 'sendBundle').mockRejectedValue(new Error('RPC Error'));
      await expect(searcher.sendBundle({ transactions: [] }))
        .rejects
        .toThrow('Transaction failed');
    });
  });

  describe('Simulation', () => {
    it('should validate bundle before submission', async () => {
      const mockBundle = { transactions: [] };
      const simResult = await searcher.simulateBundle(mockBundle);
      expect(simResult).toEqual({
        success: true,
        logs: expect.any(Array)
      });
    });
  });
});