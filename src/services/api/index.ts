import { Connection } from '@solana/web3.js';
import { MarketDataService } from './marketData';
import { TokenMetadataService } from './tokenMetadata';

export class APIService {
    readonly marketData: MarketDataService;
    readonly tokenMetadata: TokenMetadataService;

    constructor(connection: Connection) {
        this.marketData = new MarketDataService(connection);
        this.tokenMetadata = new TokenMetadataService();
    }

    // Add additional API services here
}