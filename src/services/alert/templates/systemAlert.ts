interface SystemAlertTemplateParams {
    type: 'info' | 'warning' | 'error';
    message: string;
    details?: string;
    timestamp?: Date;
}

export function systemAlertTemplate(params: SystemAlertTemplateParams): {
    text: string;
    rich: {
        title: string;
        description: string;
        color: number;
        fields: { name: string; value: string }[];
    };
} {
    const { type, message, details, timestamp } = params;
    const colors = { info: 0x3498db, warning: 0xf39c12, error: 0xe74c3c };
    const emojis = { info: 'ℹ️', warning: '⚠️', error: '❌' };

    return {
        text: `${emojis[type]} [${type.toUpperCase()}] ${message}${details ? `\nDetails: ${details}` : ''}`,

        rich: {
            title: `${emojis[type]} System ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            description: message,
            color: colors[type],
            fields: [
                ...(details ? [{ name: 'Details', value: details }] : []),
                { name: 'Timestamp', value: (timestamp || new Date()).toISOString() }
            ]
        }
    };
}