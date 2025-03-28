import nodemailer from 'nodemailer';

interface EmailOptions {
    from?: string;
    subject?: string;
    html?: boolean;
}

export class EmailAlertChannel {
    private transporter: nodemailer.Transporter;

    constructor(
        private config: {
            service: string;
            auth: { user: string; pass: string };
        }
    ) {
        this.transporter = nodemailer.createTransport(config);
    }

    async sendAlert(
        to: string,
        message: string,
        options?: EmailOptions
    ): Promise<void> {
        await this.transporter.sendMail({
            from: options?.from || this.config.auth.user,
            to,
            subject: options?.subject || 'Market Alert',
            text: options?.html ? undefined : message,
            html: options?.html ? message : undefined
        });
    }
}