import { Connection, PublicKey } from '@solana/web3.js';
import { Raydium } from '@raydium-io/raydium-sdk';

export class RaydiumPoolMonitor {
    constructor(
        private readonly raydium: Raydium,
        private readonly connection: Connection
    ) {}

    async getPoolInfo(poolAddress: PublicKey) {
        return this.raydium.fetchPoolInfo(this.connection, poolAddress);
    }

    async getNewPools(lastSignature?: string): Promise<{
        pools: any[];
        lastSignature: string;
    }> {
        return this.raydium.fetchNewPools(this.connection, {
            lastSignature,
            limit: 100
        });
    }

    async watchNewPools(
        callback: (pool: any) => void,
        interval: number = 15000
    ): Promise<NodeJS.Timeout> {
        let lastSig: string | undefined;
        
        return setInterval(async () => {
            const { pools, lastSignature } = await this.getNewPools(lastSig);
            pools.forEach(callback);
            lastSig = lastSignature;
        }, interval);
    }
}