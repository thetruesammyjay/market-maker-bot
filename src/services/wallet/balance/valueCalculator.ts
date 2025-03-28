import { PublicKey } from '@solana/web3.js';
import { TokenBalanceTracker } from './tokenBalance';
import { SOLBalanceTracker } from './solBalance';

interface PortfolioValue {
    sol: number;
    tokens: { [mint: string]: number };
    total: number;
}

export class PortfolioValuator {
    constructor(
        private solTracker: SOLBalanceTracker,
        private tokenTracker: TokenBalanceTracker,
        private priceFeed: (mint: string) => Promise<number>
    ) {}

    async calculateValue(walletAddress: PublicKey): Promise<PortfolioValue> {
        const [solBalance, tokenBalances] = await Promise.all([
            this.solTracker.getBalance(walletAddress),
            this.tokenTracker.getTokenAccounts(walletAddress)
        ]);

        const solPrice = await this.priceFeed('SOL');
        const tokenValues = await Promise.all(
            tokenBalances.map(async token => {
                const price = await this.priceFeed(token.mint);
                return {
                    mint: token.mint,
                    value: token.uiAmount * price
                };
            })
        );

        const tokens: { [mint: string]: number } = {};
        tokenValues.forEach(tv => {
            tokens[tv.mint] = tv.value;
        });

        return {
            sol: solBalance * solPrice,
            tokens,
            total: tokenValues.reduce((sum, tv) => sum + tv.value, 0) + (solBalance * solPrice)
        };
    }
}