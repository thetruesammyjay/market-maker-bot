import { WalletEncryptor } from './encryption';
import { ActivityAuditor, TradeAuditor } from './audit';
import { SolanaManager } from '../blockchain/web3';

export function initializeSecurity(solana?: SolanaManager) {
    if (!process.env.ENCRYPTION_SECRET) {
        throw new Error('ENCRYPTION_SECRET environment variable is required');
    }

    const encryptor = new WalletEncryptor(process.env.ENCRYPTION_SECRET);
    const activityAuditor = new ActivityAuditor();
    const tradeAuditor = new TradeAuditor();

    // Example: Secure wallet setup if solana manager is provided
    if (solana) {
        const originalSetWallet = solana.setWallet;
        solana.setWallet = async (keypair: Keypair) => {
            const encrypted = await encryptor.encryptKeypair(keypair);
            activityAuditor.logActivity('wallet_connected', {
                publicKey: keypair.publicKey.toBase58()
            });
            originalSetWallet.call(solana, keypair);
        };
    }

    return {
        encryptor,
        activityAuditor,
        tradeAuditor
    };
}