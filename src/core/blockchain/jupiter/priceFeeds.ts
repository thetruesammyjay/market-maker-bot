import { Jupiter } from '@jup-ag/core';
import { Connection, PublicKey } from '@solana/web3.js';

export class JupiterPriceFeed {
    constructor(private readonly jupiter: Jupiter) {}

    async getPrice(inputMint: PublicKey, outputMint: PublicKey, amount: number): Promise<number> {
        const routes = await this.jupiter.computeRoutes({
            inputMint,
            outputMint,
            amount,
            slippageBps: 50, // 0.5%
            onlyDirectRoutes: false
        });

        if (!routes || routes.length === 0) {
            throw new Error('No routes found');
        }

        return routes[0].outAmount / amount;
    }

    async getBestRoute(inputMint: PublicKey, outputMint: PublicKey, amount: number) {
        return this.jupiter.computeRoutes({
            inputMint,
            outputMint,
            amount,
            slippageBps: 50,
            onlyDirectRoutes: false
        });
    }
}