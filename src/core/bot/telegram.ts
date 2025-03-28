import TelegramBot from 'node-telegram-bot-api';
import { SolanaManager } from '../../blockchain/web3';
import { WalletEncryptor } from '../../security/encryption';
import { registerAllCommands } from './commands';
import { registerAllListeners } from './listeners';

export class TelegramBotCore {
  private bot: TelegramBot;
  private solana: SolanaManager;
  private encryptor: WalletEncryptor;

  constructor(token: string, solana: SolanaManager) {
    this.bot = new TelegramBot(token, { polling: true });
    this.solana = solana;
    this.encryptor = new WalletEncryptor(process.env.ENCRYPTION_SECRET!);
    
    this.initialize();
  }

  private initialize() {
    // Register all components
    registerAllCommands(this.bot, this.solana, this.encryptor);
    registerAllListeners(this.bot);

    // Error handling
    this.bot.on('polling_error', (error) => {
      console.error(`Polling error: ${error}`);
    });

    console.log('Telegram bot initialized');
  }

  public sendAlert(chatId: number, message: string) {
    this.bot.sendMessage(chatId, message);
  }
}