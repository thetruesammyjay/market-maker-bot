import { Connection, clusterApiUrl } from '@solana/web3.js';
import { Jupiter, RouteInfo } from '@jup-ag/core';
import { Raydium } from '@raydium-io/raydium-sdk';
import { ServiceErrorHandler } from './errorHandlers';
import { GlobalRateLimiter } from './rateLimiters';

interface BlockchainConnectors {
    solana: Connection;
    jupiter: Jupiter;
    raydium: Raydium;
}

export class ConnectorManager {
    private static instances: Record<string, BlockchainConnectors> = {};

    static async getConnectors(network: 'mainnet' | 'devnet' = 'mainnet'): Promise<BlockchainConnectors> {
        if (this.instances[network]) {
            return this.instances[network];
        }

        try {
            await GlobalRateLimiter.wait('rpc_connection', {
                maxRequests: 5,
                intervalMs: 1000
            });

            const rpcUrl = network === 'mainnet' 
                ? process.env.MAINNET_RPC_URL || clusterApiUrl('mainnet-beta')
                : process.env.DEVNET_RPC_URL || clusterApiUrl('devnet');

            const connection = new Connection(rpcUrl, {
                commitment: 'confirmed',
                disableRetryOnRateLimit: false
            });

            const jupiter = await Jupiter.load({
                connection,
                cluster: network,
                user: null // Will be set per request
            });

            const raydium = new Raydium(connection);

            this.instances[network] = { solana: connection, jupiter, raydium };
            return this.instances[network];
        } catch (error) {
            ServiceErrorHandler.handleBlockchainError(error);
        }
    }

    static async getRoute(
        inputMint: string,
        outputMint: string,
        amount: number,
        network: 'mainnet' | 'devnet' = 'mainnet'
    ): Promise<RouteInfo> {
        const { jupiter } = await this.getConnectors(network);
        
        try {
            await GlobalRateLimiter.wait('jupiter_route', {
                maxRequests: 10,
                intervalMs: 1000
            });

            const routes = await jupiter.computeRoutes({
                inputMint: new PublicKey(inputMint),
                outputMint: new PublicKey(outputMint),
                amount,
                slippageBps: 50,
                onlyDirectRoutes: false
            });

            if (!routes || routes.length === 0) {
                throw new Error('No routes found');
            }

            return routes[0];
        } catch (error) {
            ServiceErrorHandler.handleBlockchainError(error);
        }
    }
}