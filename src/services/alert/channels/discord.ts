import axios from 'axios';

interface DiscordWebhookOptions {
    username?: string;
    avatar_url?: string;
    embeds?: any[];
}

export class DiscordAlertChannel {
    constructor(private webhookUrl: string) {}

    async sendAlert(message: string, options?: DiscordWebhookOptions): Promise<void> {
        await axios.post(this.webhookUrl, {
            content: message,
            ...options
        });
    }

    async sendRichAlert(embed: {
        title: string;
        description: string;
        color?: number;
        fields?: { name: string; value: string; inline?: boolean }[];
    }): Promise<void> {
        await this.sendAlert('', {
            embeds: [{
                title: embed.title,
                description: embed.description,
                color: embed.color || 0x00ff00,
                fields: embed.fields || [],
                timestamp: new Date().toISOString()
            }]
        });
    }
}