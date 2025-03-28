interface PriceAlertTemplateParams {
    token: string;
    currentPrice: number;
    changePercent: number;
    threshold: number;
    direction: 'above' | 'below';
}

export function priceAlertTemplate(params: PriceAlertTemplateParams): {
    text: string;
    html: string;
    rich: {
        title: string;
        description: string;
        color: number;
        fields: { name: string; value: string }[];
    };
} {
    const { token, currentPrice, changePercent, threshold, direction } = params;
    const directionText = direction === 'above' ? 'rose above' : 'fell below';
    const emoji = direction === 'above' ? '🚀' : '📉';

    return {
        text: `Price Alert: ${token} ${directionText} $${threshold} (Current: $${currentPrice.toFixed(4)}, ${changePercent.toFixed(2)}% change) ${emoji}`,
        
        html: `<b>Price Alert</b>: ${token} ${directionText} $${threshold}<br>
               Current: $${currentPrice.toFixed(4)} (${changePercent.toFixed(2)}% change)<br>
               ${emoji}`,

        rich: {
            title: `${emoji} ${token} Price Alert`,
            description: `The price of ${token} has ${directionText} your set threshold.`,
            color: direction === 'above' ? 0x00ff00 : 0xff0000,
            fields: [
                { name: 'Current Price', value: `$${currentPrice.toFixed(4)}` },
                { name: 'Change', value: `${changePercent.toFixed(2)}%` },
                { name: 'Threshold', value: `$${threshold}` }
            ]
        }
    };
}