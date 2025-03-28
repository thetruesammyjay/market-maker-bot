import { Jupiter } from '@jup-ag/core';
import { Connection, PublicKey } from '@solana/web3.js';
import { JupiterPriceFeed } from './priceFeeds';
import { JupiterSwapHandler } from './swapHandler';

export async function initializeJupiter(connection: Connection): Promise<{
    jupiter: Jupiter;
    priceFeed: JupiterPriceFeed;
    swapHandler: JupiterSwapHandler;
}> {
    const jupiter = await Jupiter.load({
        connection,
        cluster: 'mainnet-beta',
        user: new PublicKey('11111111111111111111111111111111') // Placeholder
    });

    const priceFeed = new JupiterPriceFeed(jupiter);
    const swapHandler = new JupiterSwapHandler(jupiter, connection);

    return { jupiter, priceFeed, swapHandler };
}