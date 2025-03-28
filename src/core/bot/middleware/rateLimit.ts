import TelegramBot from 'node-telegram-bot-api';

const rateLimits = new Map<number, number>();

export function rateLimitMiddleware(
  bot: TelegramBot,
  options = { windowMs: 60000, max: 10 }
) {
  return (handler: Function) => {
    return async (msg: any, match: any) => {
      const chatId = msg.chat.id;
      const now = Date.now();
      const count = rateLimits.get(chatId) || 0;

      if (count >= options.max) {
        return bot.sendMessage(
          chatId,
          '⚠️ Too many requests. Please wait a minute.'
        );
      }

      rateLimits.set(chatId, count + 1);
      setTimeout(() => {
        const current = rateLimits.get(chatId) || 0;
        rateLimits.set(chatId, Math.max(0, current - 1));
      }, options.windowMs);

      return handler(msg, match);
    };
  };
}