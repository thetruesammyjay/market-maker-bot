import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Raydium } from '@raydium-io/raydium-sdk';

export class RaydiumLiquidityManager {
    constructor(
        private readonly raydium: Raydium,
        private readonly connection: Connection
    ) {}

    async addLiquidity(
        poolAddress: PublicKey,
        baseAmount: number,
        quoteAmount: number,
        userKeypair: Keypair
    ): Promise<string> {
        const { transaction } = await this.raydium.addLiquidity({
            connection: this.connection,
            pool: poolAddress,
            baseAmount,
            quoteAmount,
            user: userKeypair.publicKey
        });

        transaction.sign([userKeypair]);
        return this.connection.sendRawTransaction(transaction.serialize());
    }

    async removeLiquidity(
        lpTokenAmount: number,
        poolAddress: PublicKey,
        userKeypair: Keypair
    ): Promise<string> {
        const { transaction } = await this.raydium.removeLiquidity({
            connection: this.connection,
            pool: poolAddress,
            lpTokenAmount,
            user: userKeypair.publicKey
        });

        transaction.sign([userKeypair]);
        return this.connection.sendRawTransaction(transaction.serialize());
    }
}