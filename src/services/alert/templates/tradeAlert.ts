interface TradeAlertTemplateParams {
    type: 'buy' | 'sell' | 'swap';
    token: string;
    amount: number;
    price: number;
    txId?: string;
}

export function tradeAlertTemplate(params: TradeAlertTemplateParams): {
    text: string;
    rich: {
        title: string;
        description: string;
        fields: { name: string; value: string }[];
    };
} {
    const { type, token, amount, price, txId } = params;
    const totalValue = amount * price;

    return {
        text: `Trade Executed: ${type.toUpperCase()} ${amount} ${token} @ $${price.toFixed(4)} (Total: $${totalValue.toFixed(2)})${txId ? `\nTX: ${txId}` : ''}`,

        rich: {
            title: `✅ Trade ${type.toUpperCase()} Executed`,
            description: `Your ${type} order for ${token} has been filled`,
            fields: [
                { name: 'Amount', value: amount.toString() },
                { name: 'Price', value: `$${price.toFixed(4)}` },
                { name: 'Total Value', value: `$${totalValue.toFixed(2)}` },
                ...(txId ? [{ name: 'Transaction', value: txId }] : [])
            ]
        }
    };
}