import TelegramBot from 'node-telegram-bot-api';

export function registerMonitoringCommands(bot: TelegramBot) {
  const activeMonitors = new Map<number, NodeJS.Timeout>();

  bot.onText(/\/watch_token (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const tokenAddress = match?.[1];
    
    if (activeMonitors.has(chatId)) {
      clearInterval(activeMonitors.get(chatId)!);
    }

    const interval = setInterval(() => {
      // Implement token price checking
      bot.sendMessage(chatId, `Current price for ${tokenAddress}: $X.XX`);
    }, 30000);

    activeMonitors.set(chatId, interval);
  });

  bot.onText(/\/stop_watching/, (msg) => {
    const chatId = msg.chat.id;
    if (activeMonitors.has(chatId)) {
      clearInterval(activeMonitors.get(chatId)!);
      activeMonitors.delete(chatId);
      bot.sendMessage(chatId, 'Monitoring stopped');
    }
  });
}