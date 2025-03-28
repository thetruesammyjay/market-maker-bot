import { OrderManager } from './orderManager';
import { SlippageManager } from './slippage';
import { SolanaManager } from '../../blockchain/web3';

export function initializeExecution(solana: SolanaManager) {
    return {
        orderManager: new OrderManager(solana),
        slippageManager: new SlippageManager(
            solana.jupiter,
            parseFloat(process.env.MAX_SLIPPAGE || '1')
        )
    };
}