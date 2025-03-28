import TelegramBot from 'node-telegram-bot-api';

export function setupCallbackListeners(bot: TelegramBot) {
  bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;

    if (data?.startsWith('confirm:')) {
      const action = data.split(':')[1];
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: `Confirmed ${action}`
      });
      bot.editMessageText(`✅ ${action} confirmed`, {
        chat_id: msg?.chat.id,
        message_id: msg?.message_id
      });
    }
  });
}