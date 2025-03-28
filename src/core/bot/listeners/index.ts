import TelegramBot from 'node-telegram-bot-api';
import { setupMessageListeners } from './messages';
import { setupCallbackListeners } from './callbacks';

export function registerAllListeners(bot: TelegramBot) {
  setupMessageListeners(bot);
  setupCallbackListeners(bot);
}