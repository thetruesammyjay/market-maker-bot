import { TelegramBot } from 'node-telegram-bot-api';
import { TelegramAlertChannel } from './channels/telegram';
import { DiscordAlertChannel } from './channels/discord';
import { EmailAlertChannel } from './channels/email';
import { priceAlertTemplate } from './templates/priceAlert';
import { tradeAlertTemplate } from './templates/tradeAlert';
import { systemAlertTemplate } from './templates/systemAlert';

interface AlertChannelConfig {
    telegram?: { bot: TelegramBot; chatId: string };
    discord?: { webhookUrl: string };
    email?: { service: string; auth: { user: string; pass: string } };
}

export class AlertService {
    private channels: {
        telegram?: TelegramAlertChannel;
        discord?: DiscordAlertChannel;
        email?: EmailAlertChannel;
    } = {};

    constructor(config: AlertChannelConfig) {
        if (config.telegram) {
            this.channels.telegram = new TelegramAlertChannel(
                config.telegram.bot,
                config.telegram.chatId
            );
        }
        if (config.discord) {
            this.channels.discord = new DiscordAlertChannel(
                config.discord.webhookUrl
            );
        }
        if (config.email) {
            this.channels.email = new EmailAlertChannel(config.email);
        }
    }

    async sendPriceAlert(params: {
        token: string;
        currentPrice: number;
        changePercent: number;
        threshold: number;
        direction: 'above' | 'below';
    }): Promise<void> {
        const template = priceAlertTemplate(params);
        await Promise.all([
            this.channels.telegram?.sendRichAlert(template.rich),
            this.channels.discord?.sendRichAlert(template.rich),
            this.channels.email?.sendAlert(
                'user@example.com',
                template.html,
                { html: true, subject: `Price Alert: ${params.token}` }
            )
        ]);
    }

    async sendTradeAlert(params: {
        type: 'buy' | 'sell' | 'swap';
        token: string;
        amount: number;
        price: number;
        txId?: string;
    }): Promise<void> {
        const template = tradeAlertTemplate(params);
        await Promise.all([
            this.channels.telegram?.sendRichAlert(template.rich),
            this.channels.discord?.sendRichAlert(template.rich)
        ]);
    }

    async sendSystemAlert(params: {
        type: 'info' | 'warning' | 'error';
        message: string;
        details?: string;
    }): Promise<void> {
        const template = systemAlertTemplate(params);
        await Promise.all([
            this.channels.telegram?.sendAlert(template.text),
            this.channels.discord?.sendRichAlert(template.rich),
            this.channels.email?.sendAlert(
                'admin@example.com',
                template.text,
                { subject: `System ${params.type.toUpperCase()}` }
            )
        ]);
    }
}