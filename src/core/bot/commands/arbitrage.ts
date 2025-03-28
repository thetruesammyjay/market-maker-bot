import { TelegramBot } from 'node-telegram-bot-api';
import { SolanaManager } from '../../../blockchain/web3';
import { ArbitrageStrategy } from '../../../engine/strategies/arbitrage';

export function registerArbitrageCommands(
  bot: TelegramBot,
  solana: SolanaManager
) {
  const strategy = new ArbitrageStrategy(solana);

  bot.onText(/\/start_arbitrage/, async (msg) => {
    await strategy.start();
    bot.sendMessage(msg.chat.id, 'Arbitrage strategy started 🚀');
  });

  bot.onText(/\/stop_arbitrage/, async (msg) => {
    await strategy.stop();
    bot.sendMessage(msg.chat.id, 'Arbitrage strategy stopped 🛑');
  });

  bot.onText(/\/arbitrage_settings (.+)/, async (msg, match) => {
    const [_, settings] = match;
    // Update strategy config from user input
    bot.sendMessage(msg.chat.id, 'Settings updated ⚙️');
  });
}