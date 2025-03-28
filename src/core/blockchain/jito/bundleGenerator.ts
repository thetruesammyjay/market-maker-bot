import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { SearcherClient } from 'jito-ts';

export class BundleGenerator {
    private readonly searcher: SearcherClient;

    constructor(searcher: SearcherClient) {
        this.searcher = searcher;
    }

    async createBundle(
        transactions: (Transaction | VersionedTransaction)[],
        tipPercentage: number
    ): Promise<any> {
        const bundle = {
            transactions: transactions.map(tx => ({
                tx: tx.serialize(),
                signers: [] // Will be added by searcher
            })),
            tipPercentage
        };

        // Simulate bundle before sending
        const simResult = await this.searcher.simulateBundle(bundle);
        if (simResult.error) {
            throw new Error(`Bundle simulation failed: ${simResult.error}`);
        }

        return bundle;
    }

    async addTipPayment(bundle: any, tipAmountLamports: number): Promise<any> {
        return {
            ...bundle,
            tipPayment: {
                recipient: this.searcher.getTipAccount(),
                lamports: tipAmountLamports
            }
        };
    }
}