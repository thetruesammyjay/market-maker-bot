import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export class SOLBalanceTracker {
    constructor(private connection: Connection) {}

    async getBalance(walletAddress: PublicKey): Promise<number> {
        const lamports = await this.connection.getBalance(walletAddress);
        return lamports / LAMPORTS_PER_SOL;
    }

    async getRecentTransactions(
        walletAddress: PublicKey,
        limit = 10
    ): Promise<string[]> {
        const signatures = await this.connection.getConfirmedSignaturesForAddress2(
            walletAddress,
            { limit }
        );
        return signatures.map(sig => sig.signature);
    }
}