import { Connection } from '@solana/web3.js';
import { Jupiter } from '@jup-ag/core';
import { Raydium } from '@raydium-io/raydium-sdk';
import { keyEncryptor } from '../../../src/services/wallet/keyManagement/encryption';

export const mockConnection = {
  getBalance: jest.fn().mockResolvedValue(1000000000),
  sendRawTransaction: jest.fn().mockResolvedValue('mock-tx-id')
} as unknown as Connection;

export const mockJupiter = {
  computeRoutes: jest.fn().mockResolvedValue([{
    inAmount: 1000000,
    outAmount: 5000000,
    otherAmountThreshold: 4900000,
    marketInfos: []
  }])
} as unknown as Jupiter;

export const mockRaydium = {
  fetchPoolInfo: jest.fn().mockResolvedValue({
    basePrice: 100,
    quotePrice: 0.01
  })
} as unknown as Raydium;

export const mockSolana = {
  connection: mockConnection,
  jupiter: mockJupiter,
  raydium: mockRaydium,
  wallet: {
    getBalance: jest.fn().mockResolvedValue(10)
  }
};

export const mockEncryptor = {
  encryptKeypair: jest.fn().mockResolvedValue('encrypted-key'),
  decryptKeypair: jest.fn().mockResolvedValue({
    publicKey: { toBase58: () => '11111111111111111111111111111111' },
    secretKey: new Uint8Array(64)
  })
} as unknown as keyEncryptor;

export const sampleConfig = {
  rpcUrl: 'https://api.testnet.solana.com',
  telegramToken: 'test-token',
  testPrivateKey: '[1,2,3,...,64]'
};

export const sampleTrades = [
  {
    timestamp: new Date(),
    type: 'buy',
    token: 'SOL',
    amount: 1,
    price: 100,
    profitLoss: 50
  },
  {
    timestamp: new Date(),
    type: 'sell',
    token: 'SOL',
    amount: 1,
    price: 150,
    profitLoss: 50
  }
];