import { TokenScanner } from './tokenScanner';
import { PriceAlertManager } from './priceAlert';
import { SolanaManager } from '../../blockchain/web3';

export function initializeMonitoring(solana: SolanaManager) {
    return {
        tokenScanner: new TokenScanner(
            solana.connection,
            solana.raydium
        ),
        priceAlert: new PriceAlertManager()
    };
}