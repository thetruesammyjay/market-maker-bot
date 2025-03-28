import { JitoSearcher } from './searcherClient';
import { BundleGenerator } from './bundleGenerator';
import { Connection } from '@solana/web3.js';

export async function initializeJito(
    connection: Connection,
    endpoint: string = process.env.JITO_ENDPOINT!,
    authKey: string = process.env.JITO_AUTH_KEY!
): Promise<{
    searcher: JitoSearcher;
    bundleGenerator: BundleGenerator;
}> {
    const searcher = new JitoSearcher(endpoint, authKey, connection);
    await searcher.connect();
    
    const bundleGenerator = new BundleGenerator(searcher);
    
    return { searcher, bundleGenerator };
}