import TelegramBot from 'node-telegram-bot-api';
import { WalletEncryptor } from '../../../security/encryption';
import { SolanaManager } from '../../../blockchain/web3';

export function registerAuthCommands(
  bot: TelegramBot,
  encryptor: WalletEncryptor,
  solana: SolanaManager
) {
  // Store temporary auth data
  const authSessions = new Map<number, { step: string, data?: any }>();

  bot.onText(/\/connect_wallet/, async (msg) => {
    const chatId = msg.chat.id;
    authSessions.set(chatId, { step: 'awaiting_private_key' });
    bot.sendMessage(chatId, 'Please send your private key (will be encrypted immediately):', {
      reply_markup: {
        force_reply: true
      }
    });
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const session = authSessions.get(chatId);

    if (session?.step === 'awaiting_private_key' && msg.text) {
      try {
        const keypair = Keypair.fromSecretKey(
          new Uint8Array(JSON.parse(msg.text))
        );
        
        // Encrypt and store
        const encrypted = await encryptor.encryptKeypair(keypair);
        // Store encrypted key in DB (implementation omitted)
        
        authSessions.delete(chatId);
        solana.setWallet(keypair);
        
        bot.sendMessage(chatId, '✅ Wallet connected successfully!');
      } catch (e) {
        bot.sendMessage(chatId, '❌ Invalid private key format');
      }
    }
  });

  bot.onText(/\/disconnect_wallet/, (msg) => {
    solana.clearWallet();
    bot.sendMessage(msg.chat.id, 'Wallet disconnected');
  });
}