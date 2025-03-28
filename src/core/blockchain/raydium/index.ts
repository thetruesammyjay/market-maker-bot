import { Raydium } from '@raydium-io/raydium-sdk';
import { Connection } from '@solana/web3.js';
import { RaydiumPoolMonitor } from './poolMonitor';
import { RaydiumLiquidityManager } from './liquidity';

export function initializeRaydium(connection: Connection): {
    raydium: Raydium;
    poolMonitor: RaydiumPoolMonitor;
    liquidityManager: RaydiumLiquidityManager;
} {
    const raydium = new Raydium(connection);
    const poolMonitor = new RaydiumPoolMonitor(raydium, connection);
    const liquidityManager = new RaydiumLiquidityManager(raydium, connection);

    return { raydium, poolMonitor, liquidityManager };
}