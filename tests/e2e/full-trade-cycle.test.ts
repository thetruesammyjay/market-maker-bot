import { SolanaManager } from '../../../src/core/blockchain/web3';
import { TelegramBotCore } from '../../../src/core/bot/telegram';
import { sampleConfig } from '../../fixtures';

describe('Full Trade Cycle', () => {
  let solana: SolanaManager;
  let bot: TelegramBotCore;

  beforeAll(async () => {
    solana = new SolanaManager(sampleConfig.rpcUrl);
    await solana.initialize();
    bot = new TelegramBotCore(sampleConfig.telegramToken, solana);
  });

  it('should complete buy->monitor->sell cycle', async () => {
    // 1. Connect wallet
    await bot.sendMessage(1, '/connect_wallet');
    await bot.sendMessage(1, sampleConfig.testPrivateKey);
    
    // 2. Execute buy
    await bot.sendMessage(1, '/buy SOL 0.1');
    
    // 3. Verify balance
    const balance = await solana.wallet.getBalance();
    expect(balance).toBeGreaterThan(0);
    
    // 4. Set sell alert
    await bot.sendMessage(1, '/watch_token SOL 150');
    
    // 5. Simulate price reaching target
    await solana.engine.monitoring.priceAlert.checkPrice('SOL', 150);
    
    // 6. Verify sell execution
    const trades = solana.engine.analytics.exporter.filterByToken('SOL');
    expect(trades.some(t => t.type === 'sell')).toBeTruthy();
  });
});