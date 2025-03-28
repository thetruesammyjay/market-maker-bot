import TelegramBot from 'node-telegram-bot-api';
import { SolanaManager } from '../../../blockchain/web3';

export function authMiddleware(
  bot: TelegramBot,
  solana: SolanaManager
) {
  return (handler: Function) => {
    return async (msg: any, match: any) => {
      const chatId = msg.chat.id;
      
      if (!solana.wallet) {
        return bot.sendMessage(chatId, '⚠️ Please connect your wallet first using /connect_wallet');
      }

      return handler(msg, match);
    };
  };
}