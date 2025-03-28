import TelegramBot from 'node-telegram-bot-api';
import { initializeBlockchain } from './core/blockchain/web3';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Initialize connections
  const solanaConnection = await initializeBlockchain();
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

  // Basic ping command
  bot.onText(/\/ping/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Market Maker Bot is alive!');
  });

  console.log('Bot started successfully');
}

main().catch(console.error);