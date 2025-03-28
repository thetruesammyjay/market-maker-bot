import TelegramBot from 'node-telegram-bot-api';
import { registerAuthCommands } from '../../../src/core/bot/commands/auth';
import { mockSolana, mockEncryptor } from '../../fixtures';

describe('Auth Commands', () => {
  const bot = new TelegramBot('mock-token', { polling: false });
  registerAuthCommands(bot, mockEncryptor, mockSolana);

  it('should prompt for private key on /connect_wallet', (done) => {
    bot.on('message', (msg) => {
      if (msg.text?.includes('send your private key')) {
        done();
      }
    });
    
    bot.emit('message', { text: '/connect_wallet', chat: { id: 1 } });
  });
});