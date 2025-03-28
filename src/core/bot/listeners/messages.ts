import TelegramBot from 'node-telegram-bot-api';

export function setupMessageListeners(bot: TelegramBot) {
  bot.on('message', (msg) => {
    // Log all messages
    console.log(`Message from ${msg.chat.id}: ${msg.text}`);
  });

  bot.on('edited_message', (msg) => {
    console.log(`Message edited: ${msg.text}`);
  });
}