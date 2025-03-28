import axios from 'axios';
import { Connection, PublicKey } from '@solana/web3.js';
import { RateLimiter } from './rateLimiter';

interface MarketData {
    price: number;
    liquidity: number;
    volume24h: number;
    priceChange24h: number;
}

export class MarketDataService {
    private readonly limiter = new RateLimiter(10, 1000); // 10 calls/second
    private cache = new Map<string, { data: MarketData; timestamp: number }>();
    private CACHE_TTL = 30000; // 30 seconds

    constructor(private connection: Connection) {}

    async getMarketData(pairAddress: string): Promise<MarketData> {
        const cached = this.cache.get(pairAddress);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.data;
        }

        await this.limiter.check();
        const [raydiumData, orcaData] = await Promise.all([
            this.fetchRaydiumData(pairAddress),
            this.fetchOrcaData(pairAddress)
        ]);

        const combinedData = {
            price: (raydiumData.price + orcaData.price) / 2,
            liquidity: raydiumData.liquidity + orcaData.liquidity,
            volume24h: raydiumData.volume24h + orcaData.volume24h,
            priceChange24h: (raydiumData.priceChange24h + orcaData.priceChange24h) / 2
        };

        this.cache.set(pairAddress, { data: combinedData, timestamp: Date.now() });
        return combinedData;
    }

    private async fetchRaydiumData(pairAddress: string): Promise<MarketData> {
        const { data } = await axios.get(`https://api.raydium.io/pair?pair=${pairAddress}`);
        return {
            price: data.price,
            liquidity: data.liquidity_usd,
            volume24h: data.volume24h,
            priceChange24h: data.priceChange24h
        };
    }

    private async fetchOrcaData(pairAddress: string): Promise<MarketData> {
        const { data } = await axios.get(`https://api.orca.so/pool/${pairAddress}`);
        return {
            price: data.price,
            liquidity: data.liquidity.usd,
            volume24h: data.volume.usd24h,
            priceChange24h: data.priceChange24h
        };
    }
}