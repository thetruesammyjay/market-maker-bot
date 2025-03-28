export class PriceAlertManager {
    private alerts = new Map<
        string, 
        { condition: 'above' | 'below', price: number, callback: () => void }
    >();

    addAlert(
        token: string,
        condition: 'above' | 'below',
        price: number,
        callback: () => void
    ): string {
        const alertId = `${token}-${Date.now()}`;
        this.alerts.set(alertId, { condition, price, callback });
        return alertId;
    }

    removeAlert(alertId: string): void {
        this.alerts.delete(alertId);
    }

    checkPrice(token: string, currentPrice: number): void {
        this.alerts.forEach((alert, alertId) => {
            if (alert.condition === 'above' && currentPrice > alert.price) {
                alert.callback();
                this.alerts.delete(alertId);
            } else if (alert.condition === 'below' && currentPrice < alert.price) {
                alert.callback();
                this.alerts.delete(alertId);
            }
        });
    }
}