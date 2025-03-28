import { JupiterSwapHandler } from '../../../src/core/blockchain/jupiter/swapHandler';
import { mockConnection, mockJupiter } from '../../fixtures';
import { PublicKey } from '@solana/web3.js';

describe('Jupiter Swap Handler', () => {
  let swapHandler: JupiterSwapHandler;

  beforeAll(() => {
    swapHandler = new JupiterSwapHandler(mockJupiter, mockConnection);
  });

  describe('Swap Preparation', () => {
    it('should prepare valid swap transaction', async () => {
      const mockRoute = {
        inAmount: 1000000,
        outAmount: 5000000,
        otherAmountThreshold: 4900000,
        marketInfos: []
      };
      
      const tx = await swapHandler.prepareSwapTransaction(
        mockRoute as any,
        new PublicKey('11111111111111111111111111111111')
      );
      
      expect(tx).toBeInstanceOf(VersionedTransaction);
      expect(tx.signatures.length).toBeGreaterThan(0);
    });
  });
});