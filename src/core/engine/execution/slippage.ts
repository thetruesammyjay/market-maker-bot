import { PublicKey } from '@solana/web3.js';
import { Jupiter } from '@jup-ag/core';

export class SlippageManager {
    private maxSlippageBps: number;

    constructor(private jupiter: Jupiter, maxSlippagePercent: number = 1) {
        this.maxSlippageBps = maxSlippagePercent * 100;
    }

    async calculateAdjustedAmount(
        inputMint: PublicKey,
        outputMint: PublicKey,
        amount: number
    ): Promise<number> {
        const routes = await this.jupiter.computeRoutes({
            inputMint,
            outputMint,
            amount,
            slippageBps: this.maxSlippageBps,
            onlyDirectRoutes: false
        });

        if (!routes || routes.length === 0) {
            throw new Error('No routes found');
        }

        // Return the worst-case output amount
        return routes[0].otherAmountThreshold;
    }

    async verifySlippage(
        inputMint: PublicKey,
        outputMint: PublicKey,
        expectedAmount: number,
        actualAmount: number
    ): Promise<boolean> {
        const acceptableAmount = await this.calculateAdjustedAmount(
            inputMint,
            outputMint,
            expectedAmount
        );
        
        return actualAmount >= acceptableAmount;
    }
}