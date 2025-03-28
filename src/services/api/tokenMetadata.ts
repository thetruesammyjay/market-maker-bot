import axios from 'axios';
import { PublicKey } from '@solana/web3.js';
import { RateLimiter } from './rateLimiter';

interface TokenMetadata {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
    verified: boolean;
}

export class TokenMetadataService {
    private readonly limiter = new RateLimiter(5, 1000); // 5 calls/second
    private cache = new Map<string, TokenMetadata>();

    constructor() {}

    async getMetadata(mintAddress: string): Promise<TokenMetadata> {
        if (this.cache.has(mintAddress)) {
            return this.cache.get(mintAddress)!;
        }

        await this.limiter.check();
        try {
            const { data } = await axios.get(
                `https://token-list-api.solana.com/token/${mintAddress}`
            );
            
            const metadata: TokenMetadata = {
                address: mintAddress,
                name: data.name,
                symbol: data.symbol,
                decimals: data.decimals,
                logoURI: data.logoURI,
                verified: data.verified
            };

            this.cache.set(mintAddress, metadata);
            return metadata;
        } catch (error) {
            return {
                address: mintAddress,
                name: 'Unknown',
                symbol: 'UNK',
                decimals: 9,
                verified: false
            };
        }
    }

    async getMultipleMetadata(mintAddresses: string[]): Promise<TokenMetadata[]> {
        return Promise.all(mintAddresses.map(addr => this.getMetadata(addr)));
    }
}