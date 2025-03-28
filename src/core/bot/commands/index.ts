import TelegramBot from 'node-telegram-bot-api';
import { SolanaManager } from '../../../blockchain/web3';
import { registerAuthCommands } from './auth';
import { registerTradeCommands } from './trades';
import { registerMonitoringCommands } from './monitoring';

export function registerAllCommands(
  bot: TelegramBot,
  solana: SolanaManager,
  encryptor: any
) {
  registerAuthCommands(bot, encryptor, solana);
  registerTradeCommands(bot, solana);
  registerMonitoringCommands(bot);
}