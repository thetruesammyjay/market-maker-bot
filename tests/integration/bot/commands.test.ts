import TelegramBot from 'node-telegram-bot-api';
import { registerTradeCommands } from '../../../src/core/bot/commands/trades';
import { mockSolana } from '../../fixtures';

describe('Trade Commands', () => {
  const bot = new TelegramBot('mock-token', { polling: false });
  registerTradeCommands(bot, mockSolana);

  it('should process /buy command', (done) => {
    bot.onText(/\/buy (.+)/, (msg, match) => {
      expect(match?.[1]).toBe('SOL');
      done();
    });
    
    bot.emit('message', { text: '/buy SOL', chat: { id: 1 } });
  });
});