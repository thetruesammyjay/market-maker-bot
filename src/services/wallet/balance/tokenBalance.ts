import { Connection, PublicKey } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

interface TokenBalance {
    mint: string;
    amount: number;
    decimals: number;
    uiAmount: number;
}

export class TokenBalanceTracker {
    constructor(private connection: Connection) {}

    async getTokenAccounts(walletAddress: PublicKey): Promise<TokenBalance[]> {
        const accounts = await this.connection.getParsedTokenAccountsByOwner(
            walletAddress,
            { programId: TOKEN_PROGRAM_ID }
        );

        return accounts.value.map(account => {
            const info = account.account.data.parsed.info;
            return {
                mint: info.mint,
                amount: info.tokenAmount.amount,
                decimals: info.tokenAmount.decimals,
                uiAmount: info.tokenAmount.uiAmount
            };
        });
    }

    async getTokenBalance(
        walletAddress: PublicKey,
        tokenMint: PublicKey
    ): Promise<TokenBalance | null> {
        const token = new Token(
            this.connection,
            tokenMint,
            TOKEN_PROGRAM_ID,
            {} as any
        );

        try {
            const account = await token.getAccountInfo(walletAddress);
            return {
                mint: tokenMint.toString(),
                amount: Number(account.amount),
                decimals: account.decimals,
                uiAmount: Number(account.amount) / Math.pow(10, account.decimals)
            };
        } catch (error) {
            return null;
        }
    }
}