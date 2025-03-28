import { Jupiter, RouteInfo } from '@jup-ag/core';
import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';

export class JupiterSwapHandler {
    constructor(
        private readonly jupiter: Jupiter,
        private readonly connection: Connection
    ) {}

    async prepareSwapTransaction(
        route: RouteInfo,
        userPublicKey: PublicKey,
        wrapAndUnwrapSol: boolean = true
    ): Promise<VersionedTransaction> {
        const { swapTransaction } = await this.jupiter.exchange({
            route,
            userPublicKey,
            wrapAndUnwrapSol
        });

        return swapTransaction;
    }

    async executeSwap(
        route: RouteInfo,
        userKeypair: Keypair
    ): Promise<string> {
        const swapTx = await this.prepareSwapTransaction(
            route,
            userKeypair.publicKey
        );
        
        swapTx.sign([userKeypair]);
        return this.connection.sendRawTransaction(swapTx.serialize());
    }
}