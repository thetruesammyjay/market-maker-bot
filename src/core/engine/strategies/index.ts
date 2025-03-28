import { MarketMakingStrategy } from './marketMaking';
import { SniperStrategy } from './sniper';
import { SolanaManager } from '../../blockchain/web3';

export function initializeStrategies(solana: SolanaManager) {
    return {
        marketMaking: new MarketMakingStrategy(solana),
        sniper: new SniperStrategy(solana)
    };
}